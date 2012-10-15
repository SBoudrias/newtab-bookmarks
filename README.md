newtab-bookmarks
================

Chrome extension replacing the default startpage with your bookmarks.


Features (done)
=========================
- Indexing page text to better search bookmarks ( curl/jqeury-get, cached locally, throttle the process..., output the status in the footer(indexing websites 14/268 ))
- Use a bookmark model (OOP)
- Persist the bookmark collection locally (localStorage)
- Website thumbnail: Integrate an ugly API service (easy solution)
- search function: (case insensitive search in url + title + body)
- Add domain filters (See all links from a given site)
- properly handle the search field events (keyup, focus, blur)
- compile a favicon main colors (based on domain names)
- Lazy load thumb images 
- Save UI preference in a persistent model (zoom, counts, viewMode)
- Import from delicious user feed (importer)
- use main UI object to handle properly the interface controls
- Decent list/grid design (it's ugly)
- better search filter function (so the DOM repaint only once)
- ping the tile server for all images that will be required one day (so the server has time to fetch the website thumb, Ignore the response: save bandwith)
- Focus bug with the search field... (seems ok now)

TODO
=========================
- Adjust the sources and content_type routes to use the better filter algorithm (caching of jquery object VS each hide/show)
- In the site model, code all the condition (set_content_type) to sort websites types (photo/videos/blogs/pdf/etc)
- bug with default viewmode (list/grid)
- Grid float bug: why do some elements push the next row, and break the grid pattern?
- CSS for the alerts in the footer (thinner)
- make LIST actual <A> links that we can ctrl click (no on click events...)
- Google Auth (and fetch ALL youtube favorites, and more...)
- UI tooltips
- do the heavy stuff on the background js page (fetching websites, importing facebook / twitter / delicious links)
- add better filter controle (and search within, currently, the search overrides any filters...)
- find a way to cache thumb images (but only once the tile-server send a good image, not the placeholder)
- z-index bug between the URL and the menus
- re(set) the custom style on window resize... throttled
- shadow 1px black shadow on the cog icon.
- check the count of Chrome bookmarks (or delicious), to make sure we got em all on file. If not, import/delete the ones that aren't there already.
- Url classifications (ie. a person website, a media, an open source-projet). Is Open Calay a good engine???
- add a x icon to the search
- Import URls from Freebase database
- Thumbnail server (to replace the crappy APIs?)
- Thumb server: mirror lots of subdomains, so we can max out the number of concurent download/pings
- Sync the bookmarks to a server (so we know how many users has bookmarked the same sites)
- Backend (auth, sync, import favs from github, facebook, etc)



Liscence
=========================
(c) iplanwebsites.com
