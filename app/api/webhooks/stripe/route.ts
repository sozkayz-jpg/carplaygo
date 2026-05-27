import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};
        const items = JSON.parse(metadata.items || "[]");
        const userId = metadata.userId;

        const orderNumber = `CPG-${new Date().getFullYear()}-${Math.floor(
          1000 + Math.random() * 9000
        )}`;

        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id
        );
        let subtotal = 0;
        for (const item of lineItems.data) {
          subtotal += item.amount_total || 0;
        }

        await prisma.order.create({
          data: {
            orderNumber,
            userId: userId || null,
            status: "PAID",
            subtotal,
            shippingCost: 0,
            discountAmount: 0,
            total: subtotal,
            stripePaymentIntentId: session.payment_intent as string,
            stripeSessionId: session.id,
            items: {
              create: items.map((item: { productId: string; quantity: number }) => ({
                productId: item.productId,
                productName: "CarplayGO",
                price: subtotal / item.quantity,
                quantity: item.quantity,
                total: subtotal,
              })),
            },
            statusHistory: {
              create: {
                status: "PAID",
                note: "Paiement confirmé via Stripe",
              },
            },
          },
        });
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error(`Payment failed: ${paymentIntent.id}`);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        if (charge.payment_intent) {
          await prisma.order.updateMany({
            where: {
              stripePaymentIntentId: charge.payment_intent as string,
            },
            data: { status: "REFUNDED" },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
