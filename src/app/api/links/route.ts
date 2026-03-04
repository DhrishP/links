import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { links } from "@/server/db/schema";
import { desc, eq, ilike, and } from "drizzle-orm";
import { checkApiAuth } from "../auth/route";
import * as cheerio from "cheerio";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "newest";
    const search = searchParams.get("search") || "";

    const fetchedLinks = await db.query.links.findMany({
      where: (links, { and, ilike, eq }) =>
        and(
          search ? ilike(links.title, `%${search}%`) : undefined,
          filter === "recommended" ? eq(links.isRecommended, true) : undefined,
        ),
      orderBy: [desc(links.createdAt)],
    });

    return NextResponse.json(fetchedLinks);
  } catch (error) {
    console.error("Failed to fetch links:", error);
    return NextResponse.json(
      { error: "Failed to fetch links" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuthenticated = await checkApiAuth(req);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, url, description, category, category2, isRecommended } =
      body;

    if (!title || !url) {
      return NextResponse.json(
        { error: "Title and URL are required" },
        { status: 400 },
      );
    }

    let imageUrl = null;
    try {
      // Attempt to automatically fetch the OpenGraph image from the URL
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Links/1.0.0 (Minimalist Link Collector)",
        },
        timeout: 5000,
      } as RequestInit);
      if (response.ok) {
        const html = await response.text();
        const $ = cheerio.load(html);
        imageUrl =
          $('meta[property="og:image"]').attr("content") ||
          $('meta[name="twitter:image"]').attr("content") ||
          null;

        // Handle relative URLs if present (basic fallback)
        if (imageUrl && !imageUrl.startsWith("http")) {
          const urlObj = new URL(url);
          imageUrl = `${urlObj.origin}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
        }
      }
    } catch (fetchError) {
      console.warn("Could not fetch og:image for url:", url, fetchError);
    }

    const [newLink] = await db
      .insert(links)
      .values({
        title,
        url,
        description,
        category,
        category2,
        imageUrl,
        isRecommended: isRecommended || false,
      })
      .returning();

    return NextResponse.json(newLink, { status: 201 });
  } catch (error) {
    console.error("Failed to create link:", error);
    return NextResponse.json(
      { error: "Failed to create link" },
      { status: 500 },
    );
  }
}
