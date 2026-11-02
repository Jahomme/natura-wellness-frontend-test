import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSubscription, skipNextShipment } from "../../api/mockApi";
import { ApiError } from "../../api/types";
import { createMockSubscription } from "../../test/subscriptionFixtures";
import { SubscriptionCard } from "../SubscriptionCard";

// Mock the API module
vi.mock("../../api/mockApi", () => ({
  getSubscription: vi.fn(),
  skipNextShipment: vi.fn(),
}));

describe("SubscriptionCard - Part A", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("1. Prevention of accidental skips", () => {
    it("does not call the API immediately upon clicking 'Skip next shipment', but opens a confirmation prompt showing the new date", async () => {
      const user = userEvent.setup();
      const mockSub = createMockSubscription({
        nextChargeAt: "2026-11-08T12:00:00.000Z",
        intervalDays: 30,
      });

      vi.mocked(getSubscription).mockResolvedValueOnce(mockSub);

      render(<SubscriptionCard />);

      // Wait for card to load
      const skipButton = await screen.findByRole("button", { name: /^skip next shipment$/i });

      // Click Skip shipment trigger
      await user.click(skipButton);

      // Verify API has NOT been called yet
      expect(skipNextShipment).not.toHaveBeenCalled();

      // Verify the confirmation dialog is opened
      const dialog = screen.getByRole("dialog", { name: /skip your next shipment\?/i });
      expect(dialog).toBeInTheDocument();

      // Verify both current and new dates are shown in the prompt within the dialog
      expect(within(dialog).getByText("Nov 8, 2026")).toBeInTheDocument(); // current date
      expect(within(dialog).getByText("Dec 8, 2026")).toBeInTheDocument(); // new date (+30 days)

      // Safe option should be present
      const keepButton = within(dialog).getByRole("button", { name: /keep shipment/i });
      expect(keepButton).toBeInTheDocument();

      // Clicking 'Keep shipment' closes the prompt without calling API
      await user.click(keepButton);
      expect(skipNextShipment).not.toHaveBeenCalled();
    });
  });

  describe("2. Successful skip flow", () => {
    it("calls skipNextShipment on acceptance and advances the date by 30 days", async () => {
      const user = userEvent.setup();
      const initialSub = createMockSubscription({
        nextChargeAt: "2026-11-08T12:00:00.000Z",
        updatedAt: "2026-11-01T12:00:00.000Z",
        intervalDays: 30,
      });

      const updatedSub = {
        ...initialSub,
        nextChargeAt: "2026-12-08T12:00:00.000Z", // +30 days
        updatedAt: "2026-11-08T13:00:00.000Z",
      };

      vi.mocked(getSubscription).mockResolvedValueOnce(initialSub);
      vi.mocked(skipNextShipment).mockResolvedValueOnce(updatedSub);

      render(<SubscriptionCard />);

      // Wait for initial render and open modal
      const openModalBtn = await screen.findByRole("button", { name: /^skip next shipment$/i });
      await user.click(openModalBtn);

      const dialog = screen.getByRole("dialog", { name: /skip your next shipment\?/i });
      const confirmBtn = within(dialog).getByRole("button", { name: /yes, skip shipment/i });
      await user.click(confirmBtn);

      // Verify API was called with exact subscriptionId and expectedUpdatedAt
      expect(skipNextShipment).toHaveBeenCalledTimes(1);
      expect(skipNextShipment).toHaveBeenCalledWith({
        subscriptionId: "sub_8F2K41",
        expectedUpdatedAt: "2026-11-01T12:00:00.000Z",
      });

      // Verify the new date (Dec 8, 2026) is displayed in the hero section
      await waitFor(() => {
        const nextShipmentHero = screen.getByText("Next shipment").closest("div");
        expect(nextShipmentHero).toHaveTextContent("Dec 8, 2026");
      });

      // Verify the success confirmation banner is displayed
      const successBanner = screen.getByRole("status");
      expect(successBanner).toHaveTextContent(/next shipment skipped/i);
      expect(successBanner).toHaveTextContent(/Dec 8, 2026/);
    });
  });

  describe("3. Handling 409 conflicts", () => {
    it("displays a clear message when a 409 concurrency conflict occurs and provides an option to refresh", async () => {
      const user = userEvent.setup();
      const initialSub = createMockSubscription({
        nextChargeAt: "2026-11-08T12:00:00.000Z",
        updatedAt: "2026-11-01T12:00:00.000Z",
      });

      vi.mocked(getSubscription).mockResolvedValueOnce(initialSub);
      vi.mocked(skipNextShipment).mockRejectedValueOnce(
        new ApiError(409, "Subscription was modified since it was loaded")
      );

      render(<SubscriptionCard />);

      // Open modal and confirm skip
      const openModalBtn = await screen.findByRole("button", { name: /^skip next shipment$/i });
      await user.click(openModalBtn);

      const dialog = screen.getByRole("dialog", { name: /skip your next shipment\?/i });
      const confirmBtn = within(dialog).getByRole("button", { name: /yes, skip shipment/i });
      await user.click(confirmBtn);

      // Expect 409 conflict alert to appear
      const alert = await screen.findByRole("alert");
      expect(alert).toHaveTextContent(/subscription changed elsewhere/i);
      expect(alert).toHaveTextContent(
        /we didn't skip this shipment yet\. refresh to review the latest details/i
      );

      // Next charge date in hero should NOT have changed
      const nextShipmentHero = screen.getByText("Next shipment").closest("div");
      expect(nextShipmentHero).toHaveTextContent("Nov 8, 2026");

      // Verify the refresh option is available and clicking it re-fetches latest subscription
      const refreshBtn = within(alert).getByRole("button", { name: /refresh subscription/i });
      expect(refreshBtn).toBeInTheDocument();

      const refreshedSub = {
        ...initialSub,
        updatedAt: "2026-11-08T15:00:00.000Z",
      };
      vi.mocked(getSubscription).mockResolvedValueOnce(refreshedSub);

      await user.click(refreshBtn);

      expect(getSubscription).toHaveBeenCalledTimes(2);

      // Conflict alert should disappear upon successful refresh
      await waitFor(() => {
        expect(screen.queryByText(/subscription changed elsewhere/i)).not.toBeInTheDocument();
      });
    });
  });

  describe("4. Status-based rules", () => {
    it("does not render the skip button when subscription is 'paused'", async () => {
      const pausedSub = createMockSubscription({
        status: "paused",
        nextChargeAt: null,
        nextChargeTotalCents: null,
        pausedUntil: "2026-11-26T12:00:00.000Z",
      });

      vi.mocked(getSubscription).mockResolvedValueOnce(pausedSub);

      render(<SubscriptionCard />);

      // Verify paused status badge and banner
      await screen.findByText(/paused until Nov 26, 2026/i);
      expect(screen.getByText("Paused")).toBeInTheDocument();

      // Ensure the skip button is NOT rendered
      expect(screen.queryByRole("button", { name: /skip/i })).not.toBeInTheDocument();
    });

    it("does not render the skip button when subscription is 'cancelled'", async () => {
      const cancelledSub = createMockSubscription({
        status: "cancelled",
        nextChargeAt: null,
        nextChargeTotalCents: null,
        cancelledAt: "2026-10-23T12:00:00.000Z",
      });

      vi.mocked(getSubscription).mockResolvedValueOnce(cancelledSub);

      render(<SubscriptionCard />);

      // Verify cancelled status badge and banner
      await screen.findByText(/cancelled on Oct 23, 2026/i);
      expect(screen.getByText("Cancelled")).toBeInTheDocument();

      // Ensure the skip button is NOT rendered
      expect(screen.queryByRole("button", { name: /skip/i })).not.toBeInTheDocument();
    });
  });

  describe("5. Handling 500 errors", () => {
    it("displays a 'Try again' button when the initial load fails with 500 and allows recovering", async () => {
      const user = userEvent.setup();

      // Initial call fails with 500
      vi.mocked(getSubscription).mockRejectedValueOnce(
        new ApiError(500, "Internal server error")
      );

      render(<SubscriptionCard />);

      // Verify error alert and message
      const alert = await screen.findByRole("alert");
      expect(alert).toHaveTextContent(/couldn't load your subscription/i);
      expect(alert).toHaveTextContent(/internal server error/i);

      // Verify 'Try again' button exists
      const retryBtn = within(alert).getByRole("button", { name: /try again/i });
      expect(retryBtn).toBeInTheDocument();

      // Mock successful response on retry
      const mockSub = createMockSubscription();
      vi.mocked(getSubscription).mockResolvedValueOnce(mockSub);

      await user.click(retryBtn);

      // Verify subscription card loads successfully after retry
      await screen.findByText(/manage my subscription/i);
      expect(screen.queryByText(/internal server error/i)).not.toBeInTheDocument();
    });

    it("displays an error with 'Try again' when skip mutation fails with 500, keeping schedule unchanged", async () => {
      const user = userEvent.setup();
      const initialSub = createMockSubscription({
        nextChargeAt: "2026-11-08T12:00:00.000Z",
      });

      vi.mocked(getSubscription).mockResolvedValueOnce(initialSub);
      vi.mocked(skipNextShipment).mockRejectedValueOnce(
        new ApiError(500, "Internal server error")
      );

      render(<SubscriptionCard />);

      // Open modal and confirm skip
      const openModalBtn = await screen.findByRole("button", { name: /^skip next shipment$/i });
      await user.click(openModalBtn);

      const dialog = screen.getByRole("dialog", { name: /skip your next shipment\?/i });
      const confirmBtn = within(dialog).getByRole("button", { name: /yes, skip shipment/i });
      await user.click(confirmBtn);

      // Alert should display error
      const alert = await screen.findByRole("alert");
      expect(alert).toHaveTextContent(/couldn't skip shipment/i);
      expect(alert).toHaveTextContent(/your billing schedule hasn't changed/i);

      // Schedule remains Nov 8, 2026 in the hero
      const nextShipmentHero = screen.getByText("Next shipment").closest("div");
      expect(nextShipmentHero).toHaveTextContent("Nov 8, 2026");

      // Try again button exists and can reopen modal
      const retryBtn = within(alert).getByRole("button", { name: /try again/i });
      expect(retryBtn).toBeInTheDocument();

      await user.click(retryBtn);
      expect(screen.getByRole("dialog", { name: /skip your next shipment\?/i })).toBeInTheDocument();
    });
  });
});
