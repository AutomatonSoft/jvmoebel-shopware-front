import { describe, expect, test } from "bun:test";

import {
  getContactInquiryComment,
  getContactInquirySubject,
} from "@/features/contact/model/contact-inquiry";
import { parseContactInquiry } from "@/features/contact/model/validation";

function createFormData() {
  const formData = new FormData();

  formData.set("address", "  Musterstraße 12\n12345 Berlin ");
  formData.set("comment", " Ich interessiere mich für einen Esstisch. ");
  formData.set("email", "  kunde@example.com ");
  formData.set("firstName", "  Max ");
  formData.set("lastName", " Mustermann  ");

  return formData;
}

describe("parseContactInquiry", () => {
  test("normalizes complete contact input", () => {
    expect(parseContactInquiry(createFormData())).toEqual({
      address: "Musterstraße 12\n12345 Berlin",
      comment: "Ich interessiere mich für einen Esstisch.",
      email: "kunde@example.com",
      firstName: "Max",
      lastName: "Mustermann",
    });
  });

  test("rejects a missing address and invalid email address", () => {
    const formData = createFormData();
    formData.set("address", " ");
    formData.set("email", "not-an-email");

    expect(parseContactInquiry(formData)).toBeNull();
  });

  test("formats the Shopware contact message", () => {
    const inquiry = parseContactInquiry(createFormData());

    expect(inquiry).not.toBeNull();
    expect(getContactInquirySubject(inquiry!)).toBe(
      "Kontaktanfrage von Max Mustermann",
    );
    expect(getContactInquiryComment(inquiry!)).toBe(
      "Adresse:\nMusterstraße 12\n12345 Berlin\n\nAnfrage:\nIch interessiere mich für einen Esstisch.",
    );
  });
});
