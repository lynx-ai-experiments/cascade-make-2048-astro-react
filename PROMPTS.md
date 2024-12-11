| Property    | Value                          |
| ----------- | ------------------------------ |
| Environment | Windsurf (Cascade, Write mode) |
| Model       | Claude 3.5 Sonnet              |

# Step 1: Generate the project

I did not do multiple attempts here.

> make a playable 2048 game with smooth animations via Framer Motion and React,
> in an Astro app, using Tailwind CSS"

Even though Cascade was in Write mode, it just gave me instructions to create
the project, including generated code, but expected me to do it manually. The
code in this repo is that generated code, manually added as instructed by
Claude.

# Step 2: Code cleanup

## [Attempt 1](https://github.com/lynx-ai-experiments/cascade-make-2048-astro-react/blob/step2-att1-cleanup/PROMPTS.md)

## [Attempt 2](https://github.com/lynx-ai-experiments/cascade-make-2048-astro-react/blob/step2-att2-cleanup/PROMPTS.md)

## [Attempt 3](https://github.com/lynx-ai-experiments/cascade-make-2048-astro-react/blob/step2-att3-cleanup/PROMPTS.md)

## Attempt 4

ℹ️ **Fresh context**

This time, I'm going to prompt without the previous context since I can't seem
to get Cascade to steer away from the initial project completion and focus on
cleanup of existing files.

> I have a 2048 game in this project, please clean up all the code and remove
> any unused assets.

Windsurf immediately began using its analysis and search tools, rapidly ripping
through the codebase and its first cleanup suggestion was to run
`rm -f Welcome.astro` inside of `src/components/`, then the SVGs in
`src/assets/`, and that's where the cleanup ends. It then asked whether I'd like
it to review the game code itself (I had hoped it would after 9 analysis &
search tool uses), so I replied "yes".

It then analyzed the Game2048.tsx file, noticing a few issues such as empty
functions (`initialBoard`, `handleKeyPress`, `moveTiles`), the lack of an effect
hook to add/remove the keybaord event listener, no state management, and no tile
styling. It then edited Game2048.tsx to remedy these issues.

It still hasn't noticed that the adapter for displaying React in Astro has not
been configured. That'll be Step 3.
