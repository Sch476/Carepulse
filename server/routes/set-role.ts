import { Request, Response } from "express";

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

export async function handleSetRole(req: Request, res: Response) {
  try {
    const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
    
    // Get the authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
 
    const token = authHeader.split(" ")[1];
 
    // Validate the role
    const { role } = req.body;
    if (!role || !["hospital", "insurance"].includes(role)) {
      return res.status(400).json({ error: "Invalid role. Must be 'hospital' or 'insurance'" });
    }
 
    if (!CLERK_SECRET_KEY) {
      console.error("CLERK_SECRET_KEY not configured. Available env vars:", Object.keys(process.env).filter(k => k.includes('CLERK')));
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Verify the token and get user info from Clerk
    const verifyResponse = await fetch("https://api.clerk.com/v1/sessions/verify", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!verifyResponse.ok) {
      // Try alternative: decode JWT to get user ID
      // Clerk tokens are JWTs, we can decode the payload
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.sub;

        if (!userId) {
          return res.status(401).json({ error: "Invalid token" });
        }

        // Update user metadata using Clerk API
        const updateResponse = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${CLERK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            public_metadata: { role },
          }),
        });

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          console.error("Clerk API error:", errorData);
          return res.status(500).json({ error: "Failed to update user role" });
        }

        const updatedUser = await updateResponse.json();
        return res.json({ 
          success: true, 
          role,
          message: `Role set to ${role}` 
        });

      } catch (decodeError) {
        console.error("Token decode error:", decodeError);
        return res.status(401).json({ error: "Invalid token" });
      }
    }

    const sessionData = await verifyResponse.json();
    const userId = sessionData.user_id;

    // Update user metadata using Clerk API
    const updateResponse = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        public_metadata: { role },
      }),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error("Clerk API error:", errorData);
      return res.status(500).json({ error: "Failed to update user role" });
    }

    return res.json({ 
      success: true, 
      role,
      message: `Role set to ${role}` 
    });

  } catch (error) {
    console.error("Set role error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
