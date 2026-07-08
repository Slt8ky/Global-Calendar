# 🚀 My First Simple SaaS Project
  
This is my first self-built simple SaaS application, realtime Google calendar syncing system, integrating user authentication, calendar third-party API docking, and subscription payment capabilities. The whole project is a complete end-to-end small SaaS product developed for technical practice, protect time purpose.
  
## 📸 Project Screenshots
![alt text](<screenshots/Screenshot 2026-07-08 093442.png>)
![alt text](<screenshots/Screenshot 2026-07-08 083953.png>)
![alt text](<screenshots/Screenshot 2026-07-08 085519.png>)
![alt text](<screenshots/Screenshot 2026-07-08 090623.png>)
![alt text](<screenshots/Screenshot 2026-07-08 090708.png>)
![alt text](<screenshots/Screenshot 2026-07-08 090714.png>)
![alt text](<screenshots/Screenshot 2026-07-08 090725.png>)
![alt text](<screenshots/Screenshot 2026-07-08 090757.png>)
![alt text](<screenshots/Screenshot 2026-07-08 093121.png>)
![alt text](<screenshots/Screenshot 2026-07-08 085408.png>)
![alt text](<screenshots/Screenshot 2026-07-08 084002.png>)
![alt text](<screenshots/Screenshot 2026-07-08 023222.png>)
![alt text](<screenshots/Screenshot 2026-07-08 085415.png>)
![alt text](<screenshots/Screenshot 2026-07-08 090731.png>)

## 🛠️ Tech Stack
- **Next.js** ⚛️ – Full-stack React framework supporting App Router, server components, server actions, client components separation
- **Shadcn UI** 🎨 – Headless lightweight UI component library, customizable styles, native Tailwind CSS integration, used for all page layout, form, button and card modules
- **Supabase** 🐘 – Backend-as-a-Service platform, responsible for database storage, user email/OAuth login authentication, real-time data listening and file storage
- **Google Calendar API** 📅 – Official Google open API, realize user calendar authorization binding, event creation, query, edit and synchronization logic
- **Stripe** 💰 – Global subscription payment gateway, process user monthly recurring subscription checkout, payment status webhook callback and membership permission control
  
## 🌟 Core Features & Client Interaction (Code-Derived Logic)
All interaction logic below is extracted and sorted according to the actual business code of the project:
1. User identity system powered by Supabase
   - One-click Google account login + email account registration/login, automatic session persistence
   - Global user identity state monitoring, automatic jump to login page for unauthenticated access
2. Google Calendar third-party docking flow
   - OAuth authorization pop-up to obtain user calendar read/write permissions
   - Client-side call API to pull user existing calendar schedules, support new event creation bound to logged-in account
   - Calendar data cached locally to reduce repeated API request overhead
3. Stripe subscription payment core logic
   - Frontend checkout page jump to Stripe secure payment page
   - After successful monthly subscription payment, Supabase database marks user membership valid period
   - Backend monitor Stripe webhook events to handle subscription expiration, payment failure and refund status
4. Frontend client interactive experience
   - Component split based on client component and server component boundary of Next.js
   - Global shared data managed through React Context to avoid redundant props layer-by-layer transmission
   - Real-time page data refresh after user operation such as adding calendar events, purchasing membership, deleting contacts
  
## 📚 Key Technical Learnings From Building This Project
1. Standardized use of React Context and component state
   - Distinguish local component useState and global Context state application scenarios
   - Avoid over-reliance on Context leading to unnecessary full component re-render
2. Performance optimization with useCallback and useMemo
   - useCallback cache event handler functions passed to child components to prevent frequent re-creation
   - useMemo cache complex calculated data (calendar filtered list, subscription price calculation) to skip repeated heavy computation
3. Three different redirection methods of Next.js, applicable scenarios comparison
   - `window.location.href`: Pure client-side native JS jump, suitable for external links or simple page jump without routing cache
   - App Router native `redirect()`: Client component navigation, integrates Next routing cache and prefetch, internal page jump priority choice
   - `NextResponse.redirect()`: Only available in middleware / server actions / route handlers, server-side forced redirect, used for login interception, permission interception scenarios
  
## 📈 Future Improvement Roadmap
1. Functional optimization: Custom dedicated event operation buttons
   - Add quick create, batch delete, share calendar event custom buttons on calendar panel
2. UI compatibility: Deep mobile responsive adaptation
   - Optimize folding sidebar, calendar list, payment form layout under small screen devices
   - Adjust touch operation interaction logic for mobile terminals
3. Data statistics: Complete user behavior analysis dashboard
   - Record calendar creation volume, subscription conversion rate, page dwell time and other core indicators
   - Visual statistical charts to display user activity data
4. Payment iteration: Add annual subscription plan support
   - Current payment logic only supports monthly recurring billing; expand annual discount subscription packages
   - Realize plan switch, monthly to annual subscription upgrade settlement logic
5. Robustness enhancement: Comprehensive error capture and fallback display
   - Unified API request error interceptor for Supabase, Google Calendar, Stripe requests
   - Loading skeleton UI, error fallback prompt page for network failure, API authorization failure, subscription overdue abnormal scenarios
   - Centralized error toast notification system to feedback operation results to users
  
## ⚙️ Project Startup Guide
### 1️⃣ Environment setup
```bash
pnpm i
cp .env.example .env.local
```
Fill all required secret keys inside `.env.local`:
- Supabase project URL & anon key
- Google Calendar OAuth client ID & client secret
- Stripe publishable key, secret key and webhook signing secret
  
  
### 2️⃣ Run Web Dev Mode 💻
```bash
pnpm dev
```