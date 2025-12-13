import { createCivicAuthPlugin } from "@civic/auth/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  }
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: "9efd0ded-8be4-431c-8be4-cfcf03522a53",
  loginUrl: "/",
  callbackUrl: "/"
});

export default withCivicAuth(nextConfig);
