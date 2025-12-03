# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - heading "Login" [level=1] [ref=e3]
    - generic [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e6]: "Email:"
        - textbox "Email:" [ref=e7]
      - generic [ref=e8]:
        - generic [ref=e9]: "Password:"
        - textbox "Password:" [ref=e10]
      - button "Log In" [ref=e11] [cursor=pointer]
    - button "Google icon Continue with Google" [ref=e13] [cursor=pointer]:
      - img "Google icon" [ref=e14]
      - text: Continue with Google
    - paragraph [ref=e15]:
      - text: Don't have an account?
      - button "Sign Up" [ref=e16] [cursor=pointer]
  - button "Open Next.js Dev Tools" [ref=e22] [cursor=pointer]:
    - img [ref=e23]
  - alert [ref=e27]
```