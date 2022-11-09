install:
	docker compose run --rm web bundle install

lint:
	docker compose run --rm web bundle exec rubocop -A

test:
	docker compose run --rm web bundle exec rails test

test-pick:
	docker compose run --rm web bundle exec rails test test/models/${test}_test.rb

migrate:
	docker compose run --rm web bundle exec rails db:migrate

console:
	docker compose run --rm web bundle exec rails console

.PHONY: test
