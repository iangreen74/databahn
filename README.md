# databahn

**You've spent years building your digital life. You don't own any of it.**

Every tweet you've written, every connection you've made, every audience you've built — it all lives on servers controlled by companies that can suspend you, shadow-ban you, or disappear overnight. Your digital identity isn't yours. It's rented.

databahn changes that. One cryptographic key. One identity. Yours forever. We pull your content out of walled gardens, sign every piece of it with your key, and give you a verifiable, portable identity that no platform can touch. Not Twitter. Not Meta. Not anyone.

---

## Table of Contents

- [The Problem](#the-problem)
- [Our Solution](#our-solution)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Data Model](#data-model)
- [Identity System Deep Dive](#identity-system-deep-dive)
- [Content Signing & Verification](#content-signing--verification)
- [Getting Started](#getting-started)
- [Prototype Scope](#prototype-scope)
- [Strategic Roadmap](#strategic-roadmap)
- [Market Opportunity](#market-opportunity)
- [Competitive Landscape](#competitive-landscape)
- [Business Model Considerations](#business-model-considerations)
- [Technical Roadmap](#technical-roadmap)

---

## The Problem

Users have spent years — often over a decade — building audiences, publishing content, and forming connections on platforms they don't own.

- **Twitter/X** can suspend your account and erase 15 years of writing overnight
- **Instagram** can shadow-ban you, making your content invisible with no explanation
- **Facebook** can change its algorithm and your audience of thousands drops to dozens
- **LinkedIn** owns your professional network and gates access to your own connections

The fundamental issue: **your digital identity is rented, not owned**. You are a tenant on someone else's platform, subject to their rules, their algorithms, and their business decisions.

When a platform dies, changes policy, or simply decides you've violated a vague content guideline, years of your creative and intellectual output disappear. There is no recourse, no portability, and no proof that any of it was ever yours.

### The Fragmentation Problem

Beyond platform risk, users face identity fragmentation. You are a different person on every platform — different usernames, different audiences, different content histories. There is no unified "you" on the internet. databahn changes that.

---

## Our Solution

databahn takes an **identity-first approach** to decentralized social. Rather than trying to build yet another social network and hoping people switch, we start with the thing that matters most: **who you are**.

### Core Principles

1. **Identity is the foundation, not the platform.** Your identity is a cryptographic keypair — a mathematical proof of who you are. It exists independently of any platform, server, or company.

2. **Content follows identity.** Every piece of content you import or create is cryptographically signed with your identity. It becomes permanently and verifiably *yours*.

3. **Migration, not recreation.** We don't ask users to start over. We meet them where they are — on Twitter, Instagram, Facebook — and bring their history with them.

4. **Verification without trust.** Anyone can verify that you authored your content using your public key. No platform, no intermediary, no trust required.

---

## How It Works

### User Journey

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  1. CREATE       │     │  2. IMPORT       │     │  3. OWN          │
│  IDENTITY        │────▶│  YOUR DATA       │────▶│  YOUR PROFILE    │
│                  │     │                  │     │                  │
│  Generate Ed25519│     │  Upload Twitter  │     │  View your       │
│  keypair, receive│     │  archive. Every  │     │  reconstructed   │
│  your DID        │     │  tweet is signed │     │  profile with    │
│                  │     │  with your key   │     │  verified content│
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

**Step 1: Create Your Identity**
The user generates an Ed25519 cryptographic keypair. The public key is encoded as a W3C Decentralized Identifier (DID) using the `did:key` method. No email. No password. No phone number. Just a keypair that proves who you are.

**Step 2: Import Your Data**
The user downloads their data archive from Twitter/X (and eventually other platforms) and uploads it to databahn. The system parses every tweet, cryptographically signs it with the user's private key, and stores the signed content.

**Step 3: Own Your Profile**
The user sees their complete profile — all their content, now cryptographically attributed to their self-sovereign identity. Every post carries a verification badge confirming the signature is valid. This profile exists independently of Twitter or any other platform.

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js Application                  │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   Frontend    │  │  API Routes  │  │  Server       │  │
│  │   (React)     │  │              │  │  Components   │  │
│  │              │  │  /identity   │  │               │  │
│  │  - Landing   │  │  /import     │  │  /profile/    │  │
│  │  - Identity  │  │  /posts      │  │   [did]       │  │
│  │  - Import    │  │  /verify     │  │               │  │
│  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘  │
│         │                 │                   │          │
│  ┌──────▼─────────────────▼───────────────────▼───────┐  │
│  │                  Core Libraries                     │  │
│  │                                                     │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌───────────┐  │  │
│  │  │  Identity    │  │  Archive     │  │  Database  │  │  │
│  │  │  - keypair   │  │  - parser    │  │  - SQLite  │  │  │
│  │  │  - did       │  │  - importer  │  │  - queries │  │  │
│  │  │  - signing   │  │  - types     │  │  - schema  │  │  │
│  │  └─────────────┘  └──────────────┘  └───────────┘  │  │
│  └─────────────────────────────────────────────────────┘  │
│                             │                             │
│  ┌──────────────────────────▼──────────────────────────┐  │
│  │              SQLite Database (databahn.db)           │  │
│  │  identities | posts | connections | import_logs     │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Request Flow: Identity Creation

```
User clicks "Create Identity"
  → POST /api/identity
    → generateKeypair()        // Ed25519 via @noble/ed25519
    → publicKeyToDid()         // Encode as did:key:z6Mk...
    → createIdentity()         // Store in SQLite
  ← Return { did, publicKey }
```

### Request Flow: Archive Import

```
User uploads twitter-archive.zip
  → POST /api/import (multipart form)
    → parseTwitterArchive()     // Extract ZIP, parse JS-wrapped JSON
    → For each tweet:
      → buildSignableContent()  // Canonical JSON payload
      → signContent()           // SHA-256 hash → Ed25519 sign
      → insertPost()            // Store with signature + content hash
    → Import connections (followers/following)
    → Update profile (display name, bio)
  ← Return { tweetsImported, connectionsImported }
```

### Request Flow: Signature Verification

```
User clicks "Verify" on a post
  → POST /api/verify { postId }
    → getPostById()            // Retrieve post with stored signature
    → getIdentityById()        // Get the author's public key
    → verifySignature()        // Ed25519 verify(signature, hash, pubkey)
  ← Return { valid: true/false }
```

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | Next.js 13 (App Router, TypeScript) | Full-stack React framework. Single codebase for frontend, API routes, and server components. Rapid prototyping with type safety. |
| **Cryptography** | @noble/ed25519, @noble/hashes | Audited, zero-dependency cryptographic library. Ed25519 is the gold standard for digital signatures — fast, secure, and widely adopted across the decentralized identity ecosystem. |
| **Identity Standard** | W3C DID:key | Self-resolving decentralized identifier. The public key is embedded directly in the DID — no server, blockchain, or registry needed to verify it. |
| **Database** | SQLite (better-sqlite3) | Single-file database. Zero infrastructure. The user's entire digital identity is one portable file — aligning perfectly with the sovereignty ethos. |
| **DID Encoding** | @scure/base (Base58) | Same audited library family as noble/ed25519. Used for multicodec encoding in the did:key format. |
| **Archive Parsing** | adm-zip + custom parser | Twitter archives use a simple JS-wrapper around JSON. Our custom parser is ~30 lines — no heavy dependencies, full control over the data pipeline. |
| **UI** | Tailwind CSS + Lucide icons | Utility-first CSS for fast iteration. Lucide provides clean, consistent iconography. |

### Why These Choices

**Ed25519 over secp256k1 (Ethereum's curve):**
Ed25519 is faster, has a simpler implementation, and is the default for SSH, Signal, and most modern cryptographic systems. It's also the standard for `did:key` in the W3C specification. If we need Ethereum compatibility later, we can support multiple key types.

**SQLite over Postgres/MongoDB:**
For a prototype, SQLite eliminates all infrastructure complexity. But strategically, it also demonstrates a key principle: the user's data is *one file*. This makes portability tangible — you can literally email someone your identity database. In production, we'd migrate to IPFS/Arweave for decentralized storage, but SQLite is the right choice now.

**Custom archive parser over existing libraries:**
The `twitter-archive-reader` npm package exists but is unmaintained and designed for browser-side ZIP handling. Twitter's archive format is simple — a JS variable assignment wrapping a JSON array. Our parser handles this in ~30 lines with full type safety and zero risk of dependency rot.

---

## Project Structure

```
databahn/
├── PRODUCT_BRIEF.md                    # Product vision document
├── README.md                           # This file
├── package.json                        # Dependencies and scripts
├── next.config.js                      # Next.js configuration
├── tailwind.config.ts                  # Tailwind CSS theme (brand colors)
├── tsconfig.json                       # TypeScript configuration
│
├── src/
│   ├── types/
│   │   └── index.ts                    # Shared TypeScript interfaces
│   │
│   ├── lib/                            # Core business logic
│   │   ├── identity/
│   │   │   ├── keypair.ts              # Ed25519 key generation, hex encoding
│   │   │   ├── did.ts                  # DID:key creation, resolution, validation
│   │   │   └── signing.ts             # Content canonicalization, signing, verification
│   │   │
│   │   ├── archive/
│   │   │   ├── twitter-types.ts        # TypeScript types for Twitter archive format
│   │   │   ├── parser.ts              # ZIP extraction, JS-wrapper stripping
│   │   │   └── importer.ts            # Full import pipeline: parse → sign → store
│   │   │
│   │   └── db/
│   │       ├── connection.ts           # SQLite connection singleton
│   │       ├── schema.ts              # Table definitions, auto-migration
│   │       └── queries.ts             # All CRUD operations (identities, posts, connections)
│   │
│   ├── app/                            # Next.js App Router pages
│   │   ├── page.tsx                    # Landing page with value proposition
│   │   ├── layout.tsx                  # Root layout (Inter font, metadata)
│   │   ├── globals.css                 # Tailwind directives
│   │   ├── identity/page.tsx           # Identity creation flow
│   │   ├── import/page.tsx             # Archive upload flow
│   │   ├── profile/[did]/page.tsx      # Dynamic profile reconstruction
│   │   └── api/
│   │       ├── identity/route.ts       # POST: create identity, GET: retrieve
│   │       ├── import/route.ts         # POST: upload and process archive
│   │       ├── posts/route.ts          # GET: paginated posts by DID
│   │       └── verify/route.ts         # POST: cryptographic signature verification
│   │
│   └── components/
│       ├── identity/
│       │   ├── CreateIdentityForm.tsx  # Keypair generation UI
│       │   └── IdentityCard.tsx        # DID display with copy functionality
│       ├── import/
│       │   └── ArchiveUploader.tsx     # Drag-and-drop ZIP upload with progress
│       ├── profile/
│       │   ├── ProfileHeader.tsx       # Name, bio, DID, stats
│       │   ├── PostFeed.tsx            # Infinite-scroll post list
│       │   └── PostCard.tsx            # Individual post with verification
│       └── shared/
│           ├── Navigation.tsx          # Top nav bar
│           ├── VerificationBadge.tsx   # Cryptographic verification indicator
│           └── CopyButton.tsx          # Copy-to-clipboard utility
│
└── data/                               # gitignored — SQLite database
    └── databahn.db
```

---

## Data Model

### Entity Relationship

```
┌─────────────┐       ┌─────────────┐       ┌──────────────┐
│  identities │───1:N─│    posts     │       │  connections │
│             │       │             │       │              │
│  id (PK)    │       │  id (PK)    │       │  id (PK)     │
│  did        │       │  identity_id│───FK──│  identity_id │
│  public_key │       │  content    │       │  type        │
│  private_key│       │  signature  │       │  username    │
│  display_name│      │  content_hash│      │  platform    │
│  bio        │       │  source     │       └──────────────┘
└──────┬──────┘       │  created_at │
       │              └─────────────┘
       │
       │         ┌──────────────┐
       └───1:N───│  import_logs │
                 │              │
                 │  id (PK)     │
                 │  identity_id │
                 │  status      │
                 │  total_items │
                 │  imported    │
                 └──────────────┘
```

### Key Design Decisions

**Signatures stored per-post, not per-batch:**
Every individual post has its own Ed25519 signature and SHA-256 content hash. This means any single post can be independently verified without access to any other data. This granularity is essential for a trust-minimized system.

**Original platform metadata preserved:**
We store the original tweet ID, platform name, creation timestamp, reply-to references, like/retweet counts, hashtags, mentions, and media URLs. This allows faithful reconstruction of the original content while attributing it to the user's sovereign identity.

**Private keys stored in plaintext (prototype only):**
In production, private keys would live in a hardware security module, browser keychain, or at minimum be encrypted at rest with a user-provided passphrase. For the prototype, plaintext storage keeps the scope manageable while the schema is designed for future encryption.

---

## Identity System Deep Dive

### What is a DID?

A **Decentralized Identifier (DID)** is a W3C standard for creating globally unique identifiers that don't require a central authority. Unlike a username on Twitter or an email address on Gmail, a DID is:

- **Self-issued:** You create it yourself with no registration
- **Cryptographically verifiable:** It embeds or links to your public key
- **Platform-independent:** It works the same everywhere
- **Persistent:** No one can revoke or deactivate it

### The did:key Method

databahn uses the `did:key` method, which encodes the public key directly into the identifier:

```
did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK
        └──┘ └──────────────────────────────────────────┘
      method           base58-encoded public key
                       (with 0xed01 multicodec prefix)
```

**Why did:key?**
- **Self-resolving:** The public key is in the identifier itself. No server lookup, no blockchain query, no DNS resolution needed.
- **Offline-capable:** Verification works without internet access.
- **Simple:** Implementation is ~30 lines of code.
- **Standards-compliant:** Follows W3C DID specification.

### Key Generation Process

```
1. Generate 32 random bytes          → privateKey
2. Ed25519 scalar multiplication     → publicKey (32 bytes)
3. Prepend multicodec prefix 0xed01  → [0xed, 0x01, ...publicKey]
4. Base58btc encode                  → "6MkhaXgBZDvotDkL..."
5. Prepend "did:key:z"               → "did:key:z6MkhaXgBZDvotDkL..."
```

---

## Content Signing & Verification

### Why Sign Content?

Content signing solves a fundamental problem: **how do you prove you wrote something without trusting a platform?**

On Twitter, your tweets are attributed to you because Twitter's database says so. If Twitter disappears, so does the proof. With databahn, attribution is mathematical — your private key signed it, and anyone with your public key (embedded in your DID) can verify it.

### Signing Process

```
                    Canonical JSON
                    ┌─────────────────────┐
                    │ {                    │
Input: Post ──────▶│   "content": "...",  │──▶ SHA-256 Hash ──▶ Ed25519 Sign ──▶ Signature
       DID         │   "createdAt": "...",│         │              (private key)     │
       Metadata    │   "did": "...",      │         │                                │
                    │   "sourcePlatform":  │         ▼                                ▼
                    │     "twitter"        │    contentHash                       signature
                    │ }                    │    (32 bytes hex)                   (64 bytes hex)
                    └─────────────────────┘
```

1. **Canonicalize:** Build a JSON object with sorted keys for deterministic serialization
2. **Hash:** SHA-256 hash produces a fixed-length fingerprint of the content
3. **Sign:** Ed25519 signs the hash with the user's private key
4. **Store:** Both `contentHash` and `signature` are stored alongside the post

### Verification Process

```
Retrieve post from DB
  → Reconstruct SignableContent from stored fields
  → Recompute SHA-256 hash
  → Extract public key from the author's DID
  → Ed25519 verify(signature, hash, publicKey)
  → Returns true/false
```

Verification requires only: the post content, the signature, and the DID (which contains the public key). No server, no API call, no trust in any third party.

---

## Getting Started

### Prerequisites

- Node.js >= 18.17.0 (recommend installing via [nvm](https://github.com/nvm-sh/nvm))
- npm

### Installation

```bash
git clone https://github.com/iangreen74/databahn.git
cd databahn
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Usage Flow

1. **Create Identity** — Navigate to `/identity` and click "Create My Identity"
2. **Import Data** — Navigate to `/import` and upload your Twitter/X data archive (ZIP)
3. **View Profile** — After import, click through to your profile to see all content with verification badges

### Getting Your Twitter/X Archive

1. Go to [Twitter Settings](https://twitter.com/settings/download_your_data) → Your Account → Download an archive of your data
2. Request your archive and wait for the confirmation email (can take 24-48 hours)
3. Download the ZIP file
4. Upload it on the `/import` page

---

## Prototype Scope

### What the Prototype Demonstrates

| Feature | Status | Description |
|---------|--------|-------------|
| Identity creation | Complete | Ed25519 keypair generation, DID:key encoding |
| Twitter/X import | Complete | Full archive parsing — tweets, profile, followers, following |
| Content signing | Complete | Every imported tweet is individually signed |
| Profile reconstruction | Complete | Full profile view with content feed |
| Signature verification | Complete | Per-post cryptographic verification via API |
| Verification badges | Complete | Visual indicator on each post |
| Connection import | Complete | Followers and following lists from archive |

### What's Intentionally Deferred

- Multi-user support (prototype is single-user)
- Decentralized storage (using SQLite, not IPFS/Arweave)
- Social features (following, feeds, messaging)
- Multi-platform import (Twitter/X only for now)
- Private key encryption (plaintext for prototype simplicity)
- Native content creation (import-only for now)

---

## Strategic Roadmap

### Phase 1: Prototype (Current)
Single-user identity creation, Twitter/X archive import, profile reconstruction with cryptographic verification. Proves the core concept.

### Phase 2: Multi-Platform Import
Add import support for **Instagram**, **Facebook**, **Mastodon**, **Reddit**, and **LinkedIn** data exports. Build a normalization layer that unifies content from different platforms into a common format while preserving source metadata.

### Phase 3: Decentralized Storage
Move content from local SQLite to **IPFS** or **Arweave** for permanent, decentralized storage. Content becomes censorship-resistant and platform-independent. Identity anchoring on-chain (Ethereum or a low-cost L2) for discoverability.

### Phase 4: Social Graph
Enable users to **follow other DIDs** — not accounts on a platform, but cryptographic identities. Build a cross-platform social graph that users own. Enable discovery of connections who have also migrated to databahn.

### Phase 5: Native Publishing
Allow users to create new content directly on databahn, signed at creation time. The platform transitions from an archive viewer to a full **publishing and social experience**. Rich media support, threading, and reactions.

### Phase 6: Federation & Interoperability
Bridge to **ActivityPub** (Mastodon/Threads ecosystem) and **AT Protocol** (Bluesky). Content published on databahn appears in existing decentralized networks, and vice versa. databahn becomes an identity layer that works across protocols.

### Long-term Vision
databahn becomes the **identity layer of the internet** — a place where your digital identity lives independently of any platform, and any application can plug into it. Your identity, your content, your social graph — portable, verifiable, and permanently yours.

---

## Market Opportunity

### Macro Trends

**Eroding trust in centralized platforms**
High-profile account suspensions, unpredictable algorithm changes, data breaches, and controversial acquisitions have pushed users to seek alternatives. The Twitter/X upheaval alone drove millions of users to explore Mastodon, Bluesky, and Threads.

**Regulatory pressure toward data portability**
- **GDPR** (EU) mandates data portability rights
- **EU Digital Markets Act** requires interoperability between large platforms
- **Emerging US state privacy laws** increasingly include data portability provisions
- These regulations create both demand and legal infrastructure for platforms like databahn

**Proven willingness to switch**
Mastodon, Bluesky, Nostr, and Farcaster have collectively demonstrated that tens of millions of users will try decentralized alternatives when given a compelling reason.

**The missing piece: migration friction**
Every decentralized social platform asks users to start from zero — new identity, no content, no connections. This is the single biggest barrier to adoption. databahn solves it by letting users bring their history.

### Target Users

1. **Privacy-conscious users** — People who value data ownership and are aware of platform risks
2. **Creators and journalists** — People whose livelihoods depend on their audience and content, and who have been burned by platform decisions
3. **Crypto-native users** — Users already familiar with keypairs, wallets, and decentralized systems
4. **Platform refugees** — Users displaced by moderation decisions, algorithm changes, or platform shutdowns

---

## Competitive Landscape

| Platform | Identity | Content Import | Verification | Data Ownership |
|----------|----------|---------------|--------------|----------------|
| **Mastodon** | Server-based accounts | None | None | Server admin controlled |
| **Bluesky** | AT Protocol DIDs | Limited | None | Partially portable |
| **Nostr** | Keypair-based | None | Event signatures | User-held keys |
| **Farcaster** | Ethereum-linked | None | On-chain registration | Hybrid |
| **databahn** | **W3C DID:key** | **Full archive import** | **Per-content crypto signatures** | **Fully self-sovereign** |

### databahn's Strategic Differentiation

1. **Import-first:** We don't ask users to start over. We bring their history with them.
2. **Standards-based identity:** W3C DID is an open standard with broad industry support, not a proprietary system.
3. **Granular verification:** Every individual post is signed, not just the account. This enables per-content provenance in an era of AI-generated content.
4. **Platform-agnostic:** Not tied to any blockchain, protocol, or ecosystem. Can bridge to all of them.

---

## Business Model Considerations

### Potential Revenue Streams

**Premium identity services**
- Custom DID aliases (human-readable identifiers pointing to your did:key)
- Multi-key identity management (device keys, recovery keys)
- Identity backup and recovery services

**Enterprise & institutional**
- Organization-level identity management
- Content authenticity verification APIs for publishers and media companies
- Compliance and audit trails for regulated industries

**Storage tiers**
- Free tier with local storage
- Paid tier with decentralized permanent storage (IPFS/Arweave pinning)
- Enterprise storage with SLAs

**Developer platform**
- API access for third-party applications to verify content
- SDKs for identity integration
- Marketplace for identity-aware applications

### Alignment with Values

The core identity and verification features will always be free and open-source. Revenue comes from premium services, convenience features, and enterprise integrations — never from selling user data or gating basic identity ownership.

---

## Technical Roadmap

### Near-term (Next 3 months)

- [ ] Upgrade to Node.js 20+ and Next.js 14
- [ ] Add Instagram and Facebook archive import
- [ ] Private key encryption with user passphrase
- [ ] Identity export/backup (downloadable keypair + DID document)
- [ ] Multi-user support with authentication
- [ ] Content search within profile
- [ ] Mobile-responsive design pass

### Medium-term (3-6 months)

- [ ] IPFS integration for decentralized content storage
- [ ] Identity anchoring on Ethereum L2 (Base or Optimism)
- [ ] ActivityPub bridge (publish to Mastodon network)
- [ ] Native content creation (not just imports)
- [ ] Social graph: follow DIDs, build connections
- [ ] Content provenance standard (C2PA integration)

### Long-term (6-12 months)

- [ ] AT Protocol bridge (Bluesky interop)
- [ ] Multi-device key management
- [ ] Decentralized key recovery (social recovery, Shamir secret sharing)
- [ ] Organization/team identities
- [ ] Verifiable credentials integration
- [ ] Mobile apps (iOS/Android)

---

## Contributing

This project is in early prototype stage. If you're interested in contributing, please open an issue to discuss before submitting a PR.

## License

TBD

---

*databahn — Because your digital identity should belong to you.*
