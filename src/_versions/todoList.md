## Hebrew TTS – problematic words (future batch fix)

### Context
Hebrew TTS engines do not reliably pronounce some loanwords
(e.g. "ביי") even when niqqud is provided.

Example:
- Display: בַּיי
- Expected speech: "bay"
- Actual speech: "bey" / "ba"

### Proposed solution (NOT implemented yet)
Introduce a batch override mechanism for Hebrew TTS, to be applied
only when pressing the "בעברית" button.

Options:
1. Central override map in audio layer (e.g. "בַּיי" → "בַּאי")
2. Per-item field (e.g. heTts / heSpeak) populated during content mapping

### Decision
Deferred until full mapping of Hebrew content is completed,
so all problematic words can be handled in one batch.

Status: TODO
