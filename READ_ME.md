### Roadmap Explained

For tracking Real-World Asset (RWA) escrow, Roofstock onChain is a prime example because it uses a specific "Escrow Vault" pattern to handle property sales.
Example: Roofstock onChain (Real Estate NFT Escrow)
Roofstock onChain titles houses under individual LLCs and represents ownership as a "Home onChain" NFT. When a property is financed or sold, the NFT is moved into an escrow contract until all real-world conditions (like payment or loan approval) are finalized. 

## Network: Ethereum Mainnet
Key Contract (Escrow/Marketplace): 0x35002C93A4dE9678e0e64c39A3D063A48C8110D8 (Roofstock onChain: Marketplace)
Key Contract (NFTs/Houses): 0x296B21773B30623f982D42558f62D065bC93213c (Home onChain NFT)

## Important Subgraph Events
To track when a deal "falls through" or "executes" on this platform, your subgraph would listen for these specific events from their marketplace and vault contracts:
SaleExecuted: The successful "Closing." Money is released to the seller, and the NFT (the house) is released to the buyer.
OfferCreated / OfferAccepted: Marks the "Pending" state where funds are typically locked in the escrow logic.
OfferCancelled: This is your "Fall Through" signal. If a buyer or seller backs out before the final on-chain execution, this event is triggered, and locked funds are returned. 

## How the "Real Life" part is handled
These contracts don't magically know the deed was filed at the county office. Instead, they use a Hybrid Legal Model:
Legal Wrap: You aren't technically buying the "dirt"; you are buying 100% of the LLC that owns the dirt.
Admin Sign-off: A "Home onChain Admin" (the platform) usually acts as the oracle. Once they verify off-chain that inspections and title docs are clear, they trigger the execute function on the smart contract. 
