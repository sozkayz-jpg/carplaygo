import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/zod-schemas";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      );
    }

    const lineItems = [];
    let total = 0;

    for (const item of parsed.data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: "Produit introuvable" },
          { status: 404 }
        );
      }

      const price = product.price;
      total += price * item.quantity;

      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: product.name,
            description: product.shortDescription,
          },
          unit_amount: price,
        },
        quantity: item.quantity,
      });
    }

    const metadata: Record<string, string> = {
      items: JSON.stringify(parsed.data.items),
    };
    if (session?.user?.id) metadata.userId = session.user.id;
    if (parsed.data.promoCode) metadata.promoCode = parsed.data.promoCode;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
      metadata,
      customer_email: session?.user?.email || undefined,
      payment_method_types: ["card"],
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement" },
      { status: 500 }
    );
  }
}
