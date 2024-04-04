# Scalachess

## Description

Scalachess is a TypeScript module for chess game validation. This library provides move validation, game status checks, and support for various chess variants such as standard, chess960, antichess, atomic, and more. It enables developers to easily integrate comprehensive chess game logic into their applications.

## Features

- Validation of chess moves according to the rules of multiple variants.
- Checking the status of games (e.g., checkmate, stalemate).
- Support for special chess variants such as Crazyhouse, King of the Hill, Three-check, and others.
- Handling of chess positions (FEN strings) and move notations (SAN, UCI).
- Utilities for working with Web Workers to offload intensive computations.

## Installation

This library is packaged as a module. To include it in your project, you can clone the repository or include it as a dependency in your package.json file.

## Usage

To use scalachess in your project, you'll need to import the necessary types and functions from the module. Here's a basic example:

```javascript
import { ScalaChess, SituationResponse } from 'scalachess'

/**
 * Path to scalachess worker
 * Ex: https://github.com/saynschuman/scalachess/blob/master/public/scalachess.js
 */
const worker = new Worker('/scalachess.js')
const scalaChess = new ScalaChess(worker)

const gemeSituation = (fen: string): SituationResponse => {
    if (!fen) {
      return Promise.reject(new Error('No fen'))
    }
    const res = await scalaChess.situation({
      variant: 'standard',
      fen,
    })

    return res
}
```

## Acknowledgments

This library was inspired by and contains code from the [lichobile](https://github.com/lichess-org/lichobile) repository. We are grateful to the authors and contributors of lichobile for their work.

## License

This project is licensed under the GPL-3.0-or-later License - see the LICENSE file for details.

## Contributing

Contributions to scalachess are welcome! Please refer to the contributing guidelines for more information on how to participate in the development of this library.
