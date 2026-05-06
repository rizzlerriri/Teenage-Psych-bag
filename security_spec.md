# Security Spec for Teenage Psychbag

## Invariants
1. Only the admins (mayarawat8624@gmail.com, rawatritishka@gmail.com) can create, update, or delete Posts.
2. Only the admins can create, update, or delete Thoughts.
3. Only the admins can create or update the about_me setting document.
4. Anyone can create Comments as they are anonymous. However, comments can only be created if the referenced post exists and is published (or we can just skip the post exists check to avoid cost, but wait, the prompt says "Anonymous comments").
5. Comments can be created by anyone, but they cannot be updated. Deletion might be restricted to admin.

## Payloads
- Ghost fields in posts
- Anonymous user trying to create post
- Admin creating comment with ghost fields
- Admin spoofing someone else
- ...
