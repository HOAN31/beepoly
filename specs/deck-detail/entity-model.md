# Entity Model

## Entity: Deck

Represents a vocabulary deck. This screen shows one deck's full detail.

| Field | Type | Required | Description |
|---|---|---|---|
| id | string | yes | Unique ID |
| title | string | yes | Deck title |
| description | string | no | Optional description |
| createdAt | string | yes | Created date time |

## Entity: Card

Represents a single vocabulary flashcard inside a deck.

| Field | Type | Required | Description |
|---|---|---|---|
| id | string | yes | Unique ID |
| deckId | string | yes | Parent deck reference |
| word | string | yes | English word |
| meaning | string | yes | Vietnamese meaning |
| example | string | no | Example sentence |
| status | string | yes | Learning status (new / learning / mastered) |

## Card Status Values

| Value | Label | Meaning |
|---|---|---|
| new | New | Chưa học |
| learning | Learning | Đang học |
| mastered | Mastered | Đã thuộc |

## Deck Statistics (derived)

| Statistic | How calculated |
|---|---|
| total | Count of cards where deckId = deck.id |
| mastered | Count of cards where status = mastered |
| learning | Count of cards where status = learning |
| new | Count of cards where status = new |
| accuracy | (mastered / total) * 100% |

Invariant: mastered + learning + new = total

## Data Storage

The app stores data in localStorage with the keys:

- beepoly_decks
- beepoly_cards
