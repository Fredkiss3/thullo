.PHONY: deploy
deploy:
	heroku stack:set container -a thullo-api
	git push heroku master