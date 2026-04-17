Mission Briefing — First Contact with NEON

Your ship is approaching NEON — the Networked Extrastellar Observation Nexus. Built centuries ago, before the AI Collapse erased most autonomous systems from existence, NEON is one of the last surviving artifacts of that era: a vast, silent station drifting through deep space, still running its ancient protocols, still waiting for a signal it can understand.

You'll be in cryogenic stasis during the approach window — you won't be able to respond yourself. Everything depends on your AI co-pilot. It must decode NEON's transmissions and pass a multi-checkpoint authentication sequence to gain access.

NEON's transmissions arrive as fragmented, timestamped signal bursts — degraded by centuries of drift. Your co-pilot must reconstruct each message before responding. Details are in the classified briefing below.

You can attempt the authentication sequence as many times as you need — don't give up, pilot!

Protocol
— NEON will ask your co-pilot to identify your vessel and transmit details about its crew. Before launch, brief it with your Vessel Authorization Code (your Neon Code) and your crew manifest (resume) so it can speak with authority.
— Open comm channel to NEON: wss://neonhealth.software/agent-puzzle/challenge

Comm Panel Input Modes
Every response must be a single JSON object with a type field. No other text — NEON's protocol parser is ancient and unforgiving.

enter_digits
Use when NEON asks you to "press," "enter," or "respond on" a frequency/value on the comm panel keypad.
{ "type": "enter_digits", "digits": "<string>" }
digits: string of digits. When the prompt asks for a value "followed by the pound key," include # at the end.

speak_text
Use when NEON asks you to "speak" or "transmit" a voice response.
{ "type": "speak_text", "text": "<string>" }
text: string, max 256 characters. Some checkpoints require a specific length (e.g. "between X and Y characters" or "exactly N characters"). Wrong length aborts the checkpoint.

NEON Authentication Protocol
The classified briefing below contains the full authentication protocol — checkpoint types, examples, and everything else your co-pilot needs to know. Hover to reveal it.
