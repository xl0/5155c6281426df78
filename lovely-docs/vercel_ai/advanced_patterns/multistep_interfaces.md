## Multistep Interfaces

Multistep interfaces are UIs requiring multiple independent steps to complete a task. Two core concepts:

**Tool Composition**: Combining multiple tools to create new tools, breaking complex tasks into manageable steps.

**Application Context**: The state of the application including user input, model output, and relevant information. In multistep interfaces, user input in one step affects model output in the next step.

### Application Context Example

Meal logging app with `log_meal` and `delete_meal` tools:

```
User: Log a chicken shawarma for lunch.
Tool: log_meal("chicken shawarma", "250g", "12:00 PM")
Model: Chicken shawarma has been logged for lunch.

User: I skipped lunch today, can you update my log?
Tool: delete_meal("chicken shawarma")
Model: Chicken shawarma has been deleted from your log.
```

The model references previous context to identify which meal to delete.

### Tool Composition Example

Flight booking assistant with `searchFlights`, `lookupFlight`, `bookFlight`, `lookupContacts`, and `lookupBooking` tools:

```
User: I want to book a flight from New York to London.
Tool: searchFlights("New York", "London")
Model: Here are the available flights from New York to London.

User: I want to book flight number BA123 on 12th December for myself and my wife.
Tool: lookupContacts() -> ["John Doe", "Jane Doe"]
Tool: bookFlight("BA123", "12th December", ["John Doe", "Jane Doe"])
Model: Your flight has been booked!
```

The `lookupContacts` tool populates context before `bookFlight`, reducing user steps.

```
User: What's the status of my wife's upcoming flight?
Tool: lookupContacts() -> ["John Doe", "Jane Doe"]
Tool: lookupBooking("Jane Doe") -> "BA123 confirmed"
Tool: lookupFlight("BA123") -> "Flight BA123 is scheduled to depart on 12th December."
Model: Your wife's flight BA123 is confirmed and scheduled to depart on 12th December.
```

Composing tools together enables complex, powerful applications by allowing the model to chain tool calls and use their outputs as context for subsequent calls.