install:
	docker compose run --rm web bundle install

lint: lint-ruby lint-js

test:
	docker compose run --rm web bundle exec rails test

test-coverage:
	docker compose run --rm --env COVERAGE=true web bundle exec rails test

test-pick:
	docker compose run --rm web bundle exec rails test test/${test}_test.rb

migrate:
	docker compose run --rm web bundle exec rails db:migrate

console:
	docker compose run --rm web bundle exec rails console

bash:
	docker compose run --rm --service-ports web /bin/bash

lint-ruby:
	docker compose run --rm web bundle exec rubocop -A

lint-js:
	docker compose run --rm web yarn lint

lint-js-fix:
	docker compose run --rm web yarn lint --fix

.PHONY: test
