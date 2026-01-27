# Fur & Co - Admin Panel Overview

## 1. Purpose of the Admin Panel
The Admin Panel is a dedicated internal tool designed to manage the core eCommerce operations of the Fur & Co platform. It serves as the "Command Center" where administrators can oversee the entire business lifecycle—from product inventory and user management to order fulfillment and real-time analytics.

## 2. Built Features
Currently, the Admin Panel includes the following core modules:

*   **Dashboard**: A high-level overview of business health, featuring key performance indicators (KPIs) such as total revenue, active users, and recent order trends.
*   **Product Management**: A robust CRUD (Create, Read, Update, Delete) interface for the product catalog. Admins can manage pricing, descriptions, images, and inventory levels.
*   **Order Management**: A centralized system for tracking and managing customer orders. Includes functionality for updating order statuses (Pending, Shipped, Delivered) and viewing detailed transaction histories.
*   **User Management**: Tools to view and manage the customer base, including account statuses and role assignments.
*   **Secure Authentication**: A dedicated login system to ensure only authorized personnel can access sensitive business data.

## 3. Synchronization Requirements (Webapp & Admin)
For a seamless user experience, the following data points must be synchronized between the Admin Panel and the Customer Webapp:

*   **Product State**: Changes to product names, prices, or stock status in the Admin panel must reflect instantly on the Webapp to prevent customer dissatisfaction (e.g., ordering out-of-stock items).
*   **Order Status**: Updates to an order's fulfillment status in the Admin panel must trigger updates in the customer's "Order History" section in the Webapp.
*   **User Profiles**: Any administrative changes to user accounts (e.g., bans or role promotions) must be immediately enforced by the Webapp's authentication middleware.

## 4. Webapp Guardrailing & Necessary Changes
To maintain system integrity and security, the following guardrails should be implemented or refined in the Customer Webapp:

*   **Role-Based Access Control (RBAC)**: Ensure that only users with the `admin` role can access any `/admin` or `/backend` endpoints.
*   **Inventory Validations**: Implement real-time inventory checks during the "Add to Cart" and "Checkout" processes to prevent over-selling products.
*   **API Rate Limiting**: Protect backend services from abuse by implementing rate limits on public-facing endpoints (Search, Auth, Contact).
*   **Graceful Degrades**: If the backend service or sync-layer is down, the Webapp should display cached product data with a "Live updates temporarily unavailable" notice rather than crashing.


created on:2026-01-27

feat(admin): add system overview documentation and finalize UI refinements

- Created apps/admin/OVERVIEW.md detailing purpose, features, and sync strategy.
- Finalized About Page Hero: implemented white high-contrast text and optimized 'object-top' framing for laptop displays.
- Improved Unlimited Flow: resolved mobile layout overlaps in Category, Budget, and Pet selection pages.
- Branding: restored consistent "Fur & Co" logo across all navigation states.
- Dev Experience: fixed Vite MIME type errors via conditional base paths and relative script loading.
- Documentation: defined security guardrails and sync requirements for the customer webapp.
feat: comprehensive UI refinement, mobile stability fixes, and system documentation

created on:27-01-2026->time:20:19
Summary of changes:
- Ecosystem: Created detailed system architecture and guardrailing documentation in apps/admin/OVERVIEW.md.
- Navigation: Resolved persistent mobile navigation "jitter" by implementing a React Portal for absolute stability.
- About Page: Fixed "What We're Solving" marquee visibility with high-contrast cards, darkened background, and corrected infinite looping logic.
- About Hero: Optimized subject framing for desktop/laptop displays and enhanced text readability with nature-toned framing.
- Unlimited Flow: Increased vertical section spacing and CTA font sizes across the "Ready" and "Benefits" sections for a more premium mobile feel.
- Layout: Fixed mobile overlaps in Pet Profile, Budget, and Category selection pages.
- Branding: Restored "Fur & Co" logo consistency across all navigation states.
- DevEx: Resolved Vite build/MIME errors via conditional base paths and relative asset loading.
- Bugfixes: Repaired broken "Shop" and "Blog" navigation links in the 'Pet Parenting' and 'Story Reuse' sections.