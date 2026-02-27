# databahn — Own Your Digital Identity

## Vision

The internet fractured identity across platforms. databahn reunites it.

Every user gets a cryptographic identity they control — a single keypair that proves who they are across the entire internet. Every piece of content they've ever created gets signed and attributed to that identity. No platform can revoke it. No company can take it away. Your digital identity belongs to you.

## The Problem

Users have spent years building audiences and content on platforms they don't own. Twitter can suspend your account. Instagram can shadow-ban you. Facebook can change its algorithm and make your audience disappear. Your digital identity is rented, not owned.

When a platform dies or changes policy, your history vanishes. Years of thoughts, connections, and creative output — gone. The current model treats users as tenants. databahn makes them owners.

**Key pain points:**
- Platform lock-in: years of content trapped in walled gardens
- Identity fragmentation: different accounts, different audiences, no portability
- Zero ownership: platforms can delete, suspend, or shadow-ban at will
- No verifiability: no way to cryptographically prove authorship of your own content

## Value Proposition

1. **Self-sovereign identity** — One cryptographic keypair, one DID (Decentralized Identifier). You own it forever. It works everywhere.

2. **Portable content** — Import from any major platform. Your content moves with you, signed by your identity.

3. **Verifiable authorship** — Every post is cryptographically signed. Anyone can verify you authored it using your public DID. No platform trust required.

4. **Platform-agnostic profile** — Your profile lives outside any single platform. It's yours, reconstructed from your own data.

## How It Works

### User Journey

**Step 1: Create Your Identity**
The user generates a cryptographic keypair — an Ed25519 key encoded as a W3C Decentralized Identifier (DID). No email required. No password. The identity is pure mathematics. The user downloads and secures their private key.

**Step 2: Import Your Data**
The user uploads their data archive from a social platform (starting with Twitter/X). databahn parses the archive, extracts every post, and cryptographically signs each one with the user's private key.

**Step 3: View Your Profile**
The user sees their reconstructed profile — all their content, now cryptographically attributed to their self-sovereign identity. Each post shows a verification badge confirming the signature is valid.

**Step 4: Share & Verify**
The user can share their databahn profile. Anyone visiting it can verify the cryptographic signatures — proving the content belongs to that identity without trusting any platform.

## Technical Approach

### Identity Layer
- **Standard:** W3C DID:key specification
- **Cryptography:** Ed25519 keypairs (fast, secure, widely supported)
- **Encoding:** Multicodec + Base58 — the DID encodes the public key directly
- **Self-resolving:** No server or blockchain needed to verify a did:key — the public key is embedded in the identifier itself

### Content Signing
- Each post is canonicalized (deterministic JSON serialization)
- SHA-256 hashed to produce a content fingerprint
- Ed25519 signed with the user's private key
- Anyone with the DID (which contains the public key) can verify the signature

### Architecture (Prototype)
- **Frontend/Backend:** Next.js 14 (TypeScript, App Router)
- **Storage:** SQLite (single-file database — the user's data is literally one portable file)
- **Crypto:** @noble/ed25519 (audited, zero-dependency cryptographic library)
- **Archive parsing:** Custom parser for Twitter/X data export format

## Prototype Scope

The current prototype demonstrates:

- **Identity creation** — Generate a DID, display keypair, store securely
- **Twitter/X import** — Upload archive ZIP, parse tweets, sign each one
- **Profile reconstruction** — View profile with all imported content
- **Signature verification** — Cryptographically verify any post's authorship
- **Connection import** — Followers and following lists from archive

## Roadmap

### Phase 1: Prototype (Current)
Single-user identity creation, Twitter/X archive import, profile reconstruction with cryptographic verification.

### Phase 2: Multi-Platform Import
Add import support for Instagram, Facebook, Mastodon, Reddit, and LinkedIn data exports. Normalize content across platforms into a unified format.

### Phase 3: Decentralized Storage
Move content from local SQLite to decentralized storage (IPFS or Arweave). Content becomes permanent and platform-independent. Identity anchoring on-chain.

### Phase 4: Social Graph
Follow other DIDs. Build a cross-platform social graph owned by users, not platforms. Discover connections who have also migrated.

### Phase 5: Native Publishing
Create new content directly on databahn — not just imported content. Posts are signed at creation time. The platform becomes a full social experience.

### Phase 6: Federation & Interop
Bridge to ActivityPub (Mastodon ecosystem) and AT Protocol (Bluesky). Content published on databahn can appear in existing decentralized networks, and vice versa.

## Market Opportunity

**Growing distrust in centralized platforms**
High-profile account suspensions, algorithm changes, and data breaches have eroded trust in Big Tech. Users increasingly seek alternatives.

**Regulatory tailwinds**
GDPR's data portability requirements, the EU Digital Markets Act, and emerging US data privacy legislation all push toward user-controlled data.

**Proven demand for decentralized social**
Mastodon, Bluesky, and Nostr have demonstrated that millions of users are willing to try decentralized alternatives. What's missing is a frictionless onramp — databahn provides it by letting users bring their existing content.

**Web3 identity market**
The decentralized identity market is projected to grow significantly as enterprises, governments, and individuals adopt self-sovereign identity solutions.

## Competitive Landscape

| Platform | Identity Model | Content Migration | Verification |
|----------|---------------|-------------------|--------------|
| Mastodon | Server-based accounts | None | None |
| Bluesky | AT Protocol DIDs | Limited | None |
| Nostr | Keypair-based | None | Event signatures |
| Farcaster | Ethereum-linked | None | On-chain |
| **databahn** | **W3C DID:key** | **Full archive import** | **Per-content cryptographic signatures** |

databahn's differentiation: we don't ask users to start from scratch. We meet them where they are and bring their history with them.

## Team

[To be filled in]

---

*databahn — Because your digital identity should belong to you.*
