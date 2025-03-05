import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    JWK: '{ "kty": "OKP", "crv": "Ed25519", "x": "xdw3HTZy7CSOzbcg9-c9Vg3vRPaLTrcM_8wdQhpw1PY", "d": "_q2p9hG4ix35DrOi5TayormHREfH_aKC04frGKs4TX4" }',
    SERVER_URL: "http://localhost:4000"
  }
};

export default nextConfig;
