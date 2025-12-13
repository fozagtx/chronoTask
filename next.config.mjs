import { createCivicAuthPlugin } from "@civic/auth/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  }
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: "eea3133b-4555-403b-bee2-9044a98d029b"
});

export default withCivicAuth(nextConfig);
