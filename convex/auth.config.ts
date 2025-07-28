const config = {
  providers: [
    {
      domain: process.env.CLERK_URL,
      applicationID: "convex",
    },
  ],
};

export default config;
