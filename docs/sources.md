# Source Notes

## Skiddle

Use the Events search endpoint:

`https://www.skiddle.com/api/v1/events/search/`

Skiddle requires the `api_key` query parameter and source credit/linkback when
displaying Skiddle data.

## Ticketmaster

Use the Discovery API:

`https://app.ticketmaster.com/discovery/v2/events.json`

Ticketmaster requires the API key as the `apikey` query parameter.

## Eventbrite

Eventbrite API access is best for owned organization/account events. Broader
public event discovery can be limited by account permissions and API policy.

## Resident Advisor

Treat RA as a second phase. There are community scrapers and RA appears to use
GraphQL internally, but it is not the same as a stable approved public event
API. Use a conservative integration strategy and keep outbound RA links.

## DICE

The visible DICE partner docs are for a Ticket Holders GraphQL API. That is
useful for partner-owned events, ticket holders, orders, returns, and finance
data. It is not obviously a general public event discovery feed.
