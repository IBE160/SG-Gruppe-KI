# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - link "DS-Analyzer-Pro" [ref=e3]:
      - /url: /
    - generic [ref=e4]:
      - link "Discover" [ref=e5]:
        - /url: /discover
      - link "Preferences" [ref=e6]:
        - /url: /discover/preferences
      - link "Optimize" [ref=e7]:
        - /url: /optimize
      - link "Scrape" [ref=e8]:
        - /url: /scrape
      - link "Pricing" [ref=e9]:
        - /url: /pricing
      - link "Orders" [ref=e10]:
        - /url: /orders
      - link "Suppliers / APIs" [ref=e11]:
        - /url: /suppliers/import
      - link "Login" [ref=e12]:
        - /url: /login
  - main [ref=e13]:
    - generic [ref=e15]:
      - heading "DS-Analyzer-Pro" [level=2] [ref=e16]
      - textbox "Email" [ref=e17]
      - textbox "Password" [ref=e18]
      - generic [ref=e19]:
        - button "Sign In" [ref=e20] [cursor=pointer]
        - button "Sign Up" [ref=e21] [cursor=pointer]
      - generic [ref=e22]: or
      - button "Sign In with Google" [ref=e23] [cursor=pointer]
  - alert [ref=e24]
```