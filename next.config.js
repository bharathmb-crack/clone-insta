/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: [
      "logos-download.com",
      "cdn-icons-png.flaticon.com",
      "images.unsplash.com",
    ],
  },
  env: {
    NEXT_PUBLIC_GOOGLE_ID:
      "498508007741-0umr818i6rg9i806s863jjo2nfliciqe.apps.googleusercontent.com",
    NEXT_PUBLIC_GOOGLE_SECRET: "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",
  },
  reactStrictMode: true,
};
