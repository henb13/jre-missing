<div align="center" text-align="center">

#  <img height="23px" width="23px" padding="5px" src="./client/public/favicon.png" alt="JRE MISSING LOGO" /> JRE MISSING


<p>
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/HenB13/jre-missing?color=#ee7d2c">
  <img alt="Repository license" src="https://img.shields.io/github/license/HenB13/jre-missing?color=#ee7d2c">
  <img alt="Repository license" src="https://img.shields.io/static/v1?label=sauna+temp&message=200F&color=#ee7d2c">
  
</p>
&#xa0;
  :point_right: www.jremissing.com :point_left:
  &#xa0;
A web app that automatically detects episodes of [The Joe Rogan Experience](https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk) podcast that are currently not available on the Spotify platform by comparing the official Spotify API with a database of all episodes ever released.
</div>
&#xa0;

# Setup

Set up your database with the schema and seeds, set your environment variables, then run `npm setup` to insert all episodes in the database.

# How to run

Use `npm run dev` to run with the worker that regularly fetches updates from the Spotify API and updates the database accordingly.
