# Entity Model

## Entity: Deck

Represents a vocabulary deck (a collection of flashcards). This screen lists decks and shows summary info.

| Field | Type | Required | Description |
|---|---|---|---|
| id | string | yes | Unique ID |
| title | string | yes | Deck title |
| description | string | no | Optional description |
| createdAt | string | yes | Created date time |

Note: cardCount and masteryPercent are derived from Card data, not stored on Deck.

## Derived Values (shown on Deck Card)

| Value | How calculated |
|---|---|
| cardCount | Count of cards where deckId = deck.id |
| masteryPercent | (mastered cards / total cards) * 100 |

## Filter Values

| Value | Label | Condition |
|---|---|---|
| all | All | Show all decks |
| due | Due for review | Deck has at least 1 card with status = new or learning |
| mastered | Mastered | Deck has 0 cards with status = new or learning (all mastered) |

## Data Storage

The app stores data in localStorage with the key:

- beepoly_decks

(Cards are stored separately under beepoly_cards, managed by specs/deck-detail/.)
