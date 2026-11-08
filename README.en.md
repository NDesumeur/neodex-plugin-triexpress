# Tri express (Express sorting)

A reflex game at the sorting centre: parcels come down the conveyor belt, send each one to the bin of its colour before it crosses the line. The bins swap places, and bombs must never be sorted.

*Version française : [README.md](README.md)*

## Controls

- **←**: left bin, **↓**: middle bin, **→**: right bin. You can also click the bin.
- **P**: pause; any key to resume.
- At the end of the day, any key to start again.

## Rules

- Three parcel colours, each with its own shape so you can tell them apart without colour: **red heart**, **blue drop**, **green leaf**.
- The lowest parcel on the belt is the one you sort.
- **Bombs** (from the 9th sorted parcel): do nothing. They cross the line by themselves and are worth 5 points; sorting one is **"Boom"**.
- Three mistakes and the day is over. A mistake is a parcel sent to the **wrong bin**, a parcel that crosses the line unsorted (**"Missed"**) or a sorted bomb.
- **Every 15 sorted parcels**, the bins shuffle: watch where each colour goes.

## Points and speed

- A correctly sorted parcel is worth 10 points, multiplied by the combo: ×2 after 5 good sorts in a row, up to ×5 from 20. A mistake resets the combo.
- The belt speeds up and parcels come closer together as you sort, up to more than three times the starting speed.

## Records

Best score, number of days, parcels sorted and bombs avoided are shown next to the game.

## Data and sync

Your record and statistics are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Tri express → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
