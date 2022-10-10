
one-time purchases
==================

- the user would be purchasing `stripe products`
- we need to keep records of which `stripe products` users own
- our record might be called `productOwnership`, each product ownership has a unique id and a status

video server
------------

### naive approach
- a user wants to view a video, they call `services.videos.downloadVideo(productId)`
- video server could query the `productOwnership` database, to see if our records indicate they actually own the `productId`
- if they own it, we can return the video url

### token-crypto approach
- users can fetch an "ownership token" which is a list of product ids that they own
- a user can provide this ownership token to any server (even third parties) to prove ownership of a product
