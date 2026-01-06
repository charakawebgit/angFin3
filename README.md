# AngFin3 - Financial Calculator Suite

> Modern, high-precision financial calculators built with Angular 21

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)]()

## ✨ Features

- 📊 **20+ Financial Calculators** - TVM, WACC, Black-Scholes, NPV, IRR, and more
- 🎯 **High Precision Math** - Decimal.js for accurate financial calculations
- ⚡ **Modern Angular** - Zoneless change detection, Signal-based state
- 🎨 **Beautiful UI** - Tailwind CSS with dark mode support
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🧪 **Well Tested** - Comprehensive unit and integration tests

## 📦 Installation

```bash
npm install
npm start
```

Visit http://localhost:4200

## 🧮 Available Calculators

### Time Value of Money
- Present Value (PV)
- Future Value (FV)
- Payment (PMT)
- Interest Rate (I/Y)
- Number of Periods (N)

### Equity Analysis
- CAPM (Capital Asset Pricing Model)
- DDM (Dividend Discount Model)
- Black-Scholes Option Pricing
- DuPont ROE Analysis

### Fixed Income
- Bond Pricing
- Yield to Maturity
- Duration & Convexity

[Full calculator list →](docs/CALCULATORS.md)

## 🏗️ Architecture

```
src/app/
├── entities/          # Domain entities (calculators, finance)
│   ├── calculator/   # Calculator service & registry
│   └── finance/      # Financial formulas & utilities
├── features/         # Feature modules
│   └── calculator-workspace/  # Calculator UI
├── pages/           # Route pages
├── shared/          # Shared components & utilities
└── app.config.ts    # Application configuration
```

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for details.

## 🧪 Testing

```bash
npm test              # Run unit tests
npm run test:coverage # Generate coverage report
```

// Note: Ensure you have vitest coverage configured as per roadmap

## 📚 Documentation

- [Architecture Guide](docs/ARCHITECTURE.md)
- [Adding New Calculators](docs/ADDING_CALCULATORS.md)
- [Formula Reference](docs/FORMULAS.md)
- [Contributing Guide](CONTRIBUTING.md)

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## 📄 License

MIT © [Your Name]

## 🙏 Acknowledgments

- Decimal.js for high-precision arithmetic
- Angular team for the amazing framework
- Lucide for beautiful icons
