install:
	docker compose run --rm web bundle install

lint:
	docker compose run --rm web bundle exec rubocop -A

test:
	docker compose run --rm web bundle exec rails test

test-pick:
	docker compose run --rm web bundle exec rails test test/${test}_test.rb

migrate:
	docker compose run --rm web bundle exec rails db:migrate

console:
	docker compose run --rm web bundle exec rails console

bash:
	docker compose run --rm --service-ports web /bin/bash

.PHONY: test
