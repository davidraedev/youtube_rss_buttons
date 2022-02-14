// ==UserScript==
// @name         Youtube Rss Buttons
// @namespace    youtube_rss_buttons
// @description  Add RSS Buttons to Youtube
// @homepageURL  https://github.com/daraeman/youtube_rss_buttons
// @author       daraeman
// @version      1.3.1
// @date         2022-02-13
// @include      https://www.youtube.com/channel/*
// @include      https://www.youtube.com/c/*
// @include      https://www.youtube.com/user/*
// @downloadURL  https://github.com/daraeman/youtube_rss_buttons/raw/master/youtube_rss_buttons.user.js
// @updateURL    https://github.com/daraeman/youtube_rss_buttons/raw/master/youtube_rss_buttons.meta.js
// ==/UserScript==

(function(){
	
	function YoutubeRssButtons() {
		this.log( "YoutubeRssButtons" );
		
		this.channel_rss_button_css = `background: #ee802f; padding: 10px 16px; margin: 0px 6px 0px 0px`;
		this.channel_rss_link_css = `color: rgb( 255,255,255 ); text-decoration: none; font-size: 14px; font-weight: bold;`;
		this.page;
		this.channel_id;
		this.debug = true;
		this.element_timeout = 1000;

		this.init();
	}

	YoutubeRssButtons.prototype.init = async function() {
		this.log( "YoutubeRssButtons init" );

		this.page = this.getPage();
		this.log( "YoutubeRssButtons page", this.page );

		if ( this.page === "channel"
			|| this.page === "user"
		) {
			this.log( `YoutubeRssButtons is ${ this.page } page` );

			await this.waitForChannelPageToLoad();
			
			this.channel_id = this.getChannelIdFromChannelPage();
			this.log( "YoutubeRssButtons channel_id", this.channel_id );
			
			this.addChannelPageRssButton( this.channel_id );
		}
		else {
			this.log( "YoutubeRssButtons unknown page type", this.page );
		}

	}

	YoutubeRssButtons.prototype.wait = function(
		timeout = false
	) {
		this.log( "YoutubeRssButtons wait", timeout );

		timeout = timeout || this.element_timeout;
		
		return new Promise( resolve => setTimeout( resolve, timeout ) );
	}

	YoutubeRssButtons.prototype.waitForChannelPageToLoad = async function() {
		this.log( "YoutubeRssButtons waitForChannelPageToLoad" );

		let is_loaded = true;
		
		const channel_id = document.querySelector( `meta[itemprop="channelId"]` );
		this.log( "channel_id", channel_id );
		if ( typeof channel_id === "null" ) {
			is_loaded = false;
		}

		const subscribe_button = document.getElementById( "subscribe-button" );
		this.log( "subscribe_button", subscribe_button );
		if ( typeof subscribe_button === "null" ) {
			is_loaded = false;
		}
		else {
			const subscribe_button_parent = subscribe_button.parentElement;
			this.log( "subscribe_button_parent", subscribe_button_parent );
			if ( subscribe_button_parent.id !== "buttons" ) {
				is_loaded = false;
			}
		}
		
		if ( is_loaded === false ) {
			await this.wait( this.element_timeout );
			return await this.waitForChannelPageToLoad();
		}
		
		return channel_id;
	}

	YoutubeRssButtons.prototype.getChannelIdFromChannelPage = function() {
		this.log( "YoutubeRssButtons getChannelIdFromChannelPage" );
		
		const channel_id = document.querySelector( `meta[itemprop="channelId"]` ).content;
		
		this.log( "YoutubeRssButtons channel_id", channel_id );
		
		return channel_id;
	}

	YoutubeRssButtons.prototype.addChannelPageRssButton = function(
		channel_id
	) {
		this.log( "YoutubeRssButtons addChannelPageRssButton", channel_id );
		
		const rss_url = this.createChannelRssUrl( channel_id );
		this.log( "YoutubeRssButtons rss_url", rss_url );
		
		const parent = document.getElementById( "subscribe-button" ).parentElement;
		this.log( "YoutubeRssButtons getPage", parent );

		let new_button_el = document.createElement( "div" );

		this.log( "YoutubeRssButtons new_button_el parent.firstChild", parent.firstChild );

		parent.insertBefore(
			new_button_el,
			parent.firstChild
		);

		new_button_el.innerHTML = `
			<div id="youtube_rss_channel_rss_button" style="${ this.channel_rss_button_css }">
				<a href="${ rss_url }" style="${ this.channel_rss_link_css }">
					RSS
				</a>
			</div>
		`;
		this.log( "YoutubeRssButtons new_button_el 1", new_button_el );
		new_button_el = new_button_el.firstChild;
		this.log( "YoutubeRssButtons new_button_el 2", new_button_el );

	}

	YoutubeRssButtons.prototype.createChannelRssUrl = function(
		channel_id
	) {
		this.log( "YoutubeRssButtons createChannelRssUrl", channel_id );
		
		const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${ encodeURIComponent( channel_id ) }`;
		this.log( "YoutubeRssButtons url", url );
		
		return url;
	}

	YoutubeRssButtons.prototype.getPage = function() {
		this.log( "YoutubeRssButtons getPage" );
		
		if ( /https:\/\/www\.youtube\.com\/channel\//.test( window.location )
			|| /https:\/\/www\.youtube\.com\/c\//.test( window.location )   
		) {
			return "channel";
		}
		else if ( /https:\/\/www\.youtube\.com\/user\//.test( window.location ) ) {
			return "user";
		}
		return false;
	}

	YoutubeRssButtons.prototype.log = function(
		message,
		object
	) {
		if ( ! this.debug ) {
			return;
		}
		console.log( message, object );
	}

	new YoutubeRssButtons();

})();