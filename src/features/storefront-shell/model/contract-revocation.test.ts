import { describe, expect, test } from "bun:test";

import { buildContractRevocationMailto } from "@/features/storefront-shell/model/contract-revocation";

function getMailtoParameters(mailto: string) {
  const query = mailto.split("?")[1];

  return new URLSearchParams(query);
}

describe("buildContractRevocationMailto", () => {
  test("builds the revocation recipient, subject and body", () => {
    const mailto = buildContractRevocationMailto({
      contractId: "Bestellung 123",
      email: "max@example.com",
      name: "Max Mustermann",
      reason: "Ware nicht benötigt",
    });
    const parameters = getMailtoParameters(mailto);

    expect(mailto).toStartWith("mailto:info@jvmoebel.de?");
    expect(parameters.get("subject")).toBe("Widerruf – Bestellung 123");
    expect(parameters.get("body")).toBe(
      [
        "Hiermit widerrufe ich den folgenden Vertrag:",
        "",
        "Name: Max Mustermann",
        "Vertragsidentifikation: Bestellung 123",
        "E-Mail-Adresse: max@example.com",
        "Widerrufsgrund: Ware nicht benötigt",
      ].join("\n"),
    );
  });

  test("omits an empty optional reason", () => {
    const mailto = buildContractRevocationMailto({
      contractId: "456",
      email: "max@example.com",
      name: "Max Mustermann",
      reason: "",
    });

    expect(getMailtoParameters(mailto).get("body")).not.toContain(
      "Widerrufsgrund:",
    );
  });
});
