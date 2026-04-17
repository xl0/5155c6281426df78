## Deployment Steps

1. **Commit Changes**: Ensure `.gitignore` excludes `.env` and `node_modules`, then commit with `git add .` and `git commit -m "init"`

2. **Create Git Repository**: Create a new repository on GitHub, then push your local code using the commands GitHub provides. If you get "remote origin already exists" error, run:
```bash
rm -rf .git
git init
git add .
git commit -m "init"
```

3. **Import to Vercel**: Go to vercel.com/new, select your Git provider, sign in, and click Import next to your repository

4. **Add Environment Variables**: Expand "Environment Variables" section and paste your `.env.local` file contents. Vercel automatically parses variables into key:value format

5. **Deploy**: Click Deploy button. View your deployment by selecting the Project and clicking Domain

## Infrastructure Considerations

**Function Duration**: Vercel serverless functions default to 10 second max on Hobby Tier. LLM calls may exceed this. Increase with route segment config:
```ts
export const maxDuration = 30;
```
Max 60 seconds on Hobby Tier; check documentation for other tiers.

## Security

**Rate Limiting**: Implement to prevent abuse from high LLM costs. Follow Vercel's rate limiting guide.

**Firewall**: Use Vercel Firewall for DDoS protection and unauthorized access prevention. Enterprise teams get custom IP blocking rules.

## Troubleshooting

- Streaming not working when proxied
- Timeouts on Vercel