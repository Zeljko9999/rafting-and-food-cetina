const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8"
    }
  });

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const normalize = (value) => String(value ?? "").trim();

const buildTextEmail = (reservation) => `
New reservation request

Preferred date: ${reservation.tripDate}
Guests: ${reservation.guests}
Package: ${reservation.packageType}
Full name: ${reservation.fullName}
Email: ${reservation.email}
Phone: ${reservation.phone || "Not provided"}
Message: ${reservation.message || "No additional message"}
Submitted at: ${reservation.submittedAt}
Source page: ${reservation.sourceUrl || "Unknown"}
`;

const buildHtmlEmail = (reservation) => `
  <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #1b1a18;">
    <h1 style="margin-bottom: 16px;">New reservation request</h1>
    <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
      <tbody>
        <tr><td style="padding: 8px 12px; border: 1px solid #ddd;"><strong>Preferred date</strong></td><td style="padding: 8px 12px; border: 1px solid #ddd;">${escapeHtml(reservation.tripDate)}</td></tr>
        <tr><td style="padding: 8px 12px; border: 1px solid #ddd;"><strong>Guests</strong></td><td style="padding: 8px 12px; border: 1px solid #ddd;">${escapeHtml(reservation.guests)}</td></tr>
        <tr><td style="padding: 8px 12px; border: 1px solid #ddd;"><strong>Package</strong></td><td style="padding: 8px 12px; border: 1px solid #ddd;">${escapeHtml(reservation.packageType)}</td></tr>
        <tr><td style="padding: 8px 12px; border: 1px solid #ddd;"><strong>Full name</strong></td><td style="padding: 8px 12px; border: 1px solid #ddd;">${escapeHtml(reservation.fullName)}</td></tr>
        <tr><td style="padding: 8px 12px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px 12px; border: 1px solid #ddd;">${escapeHtml(reservation.email)}</td></tr>
        <tr><td style="padding: 8px 12px; border: 1px solid #ddd;"><strong>Phone</strong></td><td style="padding: 8px 12px; border: 1px solid #ddd;">${escapeHtml(reservation.phone || "Not provided")}</td></tr>
        <tr><td style="padding: 8px 12px; border: 1px solid #ddd;"><strong>Message</strong></td><td style="padding: 8px 12px; border: 1px solid #ddd;">${escapeHtml(reservation.message || "No additional message")}</td></tr>
        <tr><td style="padding: 8px 12px; border: 1px solid #ddd;"><strong>Submitted at</strong></td><td style="padding: 8px 12px; border: 1px solid #ddd;">${escapeHtml(reservation.submittedAt)}</td></tr>
        <tr><td style="padding: 8px 12px; border: 1px solid #ddd;"><strong>Source page</strong></td><td style="padding: 8px 12px; border: 1px solid #ddd;">${escapeHtml(reservation.sourceUrl || "Unknown")}</td></tr>
      </tbody>
    </table>
  </div>
`;

export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();

    if (normalize(formData.get("website"))) {
      return json({ message: "Reservation request sent successfully." });
    }

    const reservation = {
      tripDate: normalize(formData.get("tripDate")),
      guests: normalize(formData.get("guests")),
      packageType: normalize(formData.get("packageType")),
      fullName: normalize(formData.get("fullName")),
      email: normalize(formData.get("email")),
      phone: normalize(formData.get("phone")),
      message: normalize(formData.get("message")),
      sourceUrl: normalize(context.request.headers.get("referer")),
      submittedAt: new Date().toISOString()
    };

    if (
      !reservation.tripDate ||
      !reservation.guests ||
      !reservation.packageType ||
      !reservation.fullName ||
      !reservation.email
    ) {
      return json({ message: "Please fill in all required reservation fields." }, 400);
    }

    const resendApiKey = context.env.RESEND_API_KEY;

    if (!resendApiKey) {
      return json(
        {
          message:
            "Reservation email is not configured yet. Add RESEND_API_KEY in Cloudflare Pages settings."
        },
        500
      );
    }

    const reservationEmailTo = context.env.RESERVATION_EMAIL_TO || "info@raftingandfood.com";
    const reservationEmailFrom =
      context.env.RESERVATION_EMAIL_FROM || "Rafting & Food Cetina <onboarding@resend.dev>";

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "rafting-and-food-cetina/1.0"
      },
      body: JSON.stringify({
        from: reservationEmailFrom,
        to: [reservationEmailTo],
        subject: `Reservation request for ${reservation.tripDate} - ${reservation.fullName}`,
        html: buildHtmlEmail(reservation),
        text: buildTextEmail(reservation),
        reply_to: reservation.email
      })
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();

      return json(
        {
          message: "Email sending failed. Please check the Cloudflare variables and sender setup.",
          details: errorText.slice(0, 300)
        },
        500
      );
    }

    return json({ message: "Reservation request sent successfully." });
  } catch (error) {
    return json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unexpected error while processing the reservation request."
      },
      500
    );
  }
}
