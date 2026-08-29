import { ContextActionItem } from "@/components/customer/chat/ContextActions";

export function generateContextActions(text: string, reply: string): ContextActionItem[] {
  const customActions: ContextActionItem[] = [];
  const lowerText = text.toLowerCase();
  const lowerReply = (reply || "").toLowerCase();

  if (
    lowerText.includes("human") ||
    lowerText.includes("agent") ||
    lowerText.includes("support") ||
    lowerText.includes("person") ||
    lowerText.includes("contact")
  ) {
    customActions.push({
      id: "contact-support",
      label: "Contact Support Team",
      query: "How do I contact customer support directly?",
    });
  }

  if (lowerReply.includes("location") || lowerReply.includes("pickup") || lowerReply.includes("city")) {
    customActions.push({
      id: "view-locations",
      label: "View pickup locations",
      query: "What locations do you cover?",
    });
  }

  if (lowerReply.includes("insurance") || lowerReply.includes("protection") || lowerReply.includes("cover")) {
    customActions.push({
      id: "check-insurance",
      label: "Check insurance details",
      query: "Is insurance included?",
    });
  }

  if (lowerReply.includes("price") || lowerReply.includes("cheap") || lowerReply.includes("fleet")) {
    customActions.push({
      id: "compare-vehicles",
      label: "Compare available vehicles",
      query: "Which cars are cheapest?",
    });
  }

  return customActions.slice(0, 3);
}
