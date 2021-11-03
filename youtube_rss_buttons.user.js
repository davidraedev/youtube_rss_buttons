// ==UserScript==
// @name         Youtube Rss Buttons
// @namespace    youtube_rss_buttons
// @description  Add RSS Buttons to Youtube
// @homepageURL  https://github.com/daraeman/youtube_rss_buttons
// @author       daraeman
// @version      1.2
// @date         2021-11-03
// @include      https://www.youtube.com/*
// @require      https://code.jquery.com/jquery-3.5.1.slim.min.js
// @downloadURL  https://github.com/daraeman/youtube_rss_buttons/raw/master/youtube_rss_buttons.user.js
// @updateURL    https://github.com/daraeman/youtube_rss_buttons/raw/master/youtube_rss_buttons.meta.js
// ==/UserScript==

(function(){
	
	function YoutubeRssButtons() {
		this.log( "YoutubeRssButtons" );
		
		this.channel_rss_button_css = `background: #ee802f; padding: 10px 16px; margin: 0px 6px;`;
		this.channel_rss_link_css = `color: rgb( 255,255,255 ); text-decoration: none; font-size: 14px; font-weight: bold;`;
		this.page;
		this.channel_id;
		this.debug = true;

		this.init();
	}

	YoutubeRssButtons.prototype.init = function() {
		this.log( "YoutubeRssButtons init" );

		this.page = this.getPage();
		this.log( "YoutubeRssButtons page", this.page );

		if ( this.page === "channel" ) {
			this.log( "YoutubeRssButtons is channel page" );
			
			this.channel_id = this.getChannelIdFromChannelPage();
			this.log( "YoutubeRssButtons channel_id", this.channel_id );
			
			this.addChannelPageRssButton( this.channel_id );
		}
		else if ( this.page === "user" ) {
			this.log( "YoutubeRssButtons is user page" );
			
			this.channel_id = this.getChannelIdFromChannelPage();
			this.log( "YoutubeRssButtons channel_id", this.channel_id );
			
			this.addChannelPageRssButton( this.channel_id );
		}
		else {
			this.log( "YoutubeRssButtons unknown page type", this.page );
		}

	}

	YoutubeRssButtons.prototype.getChannelIdFromChannelPage = function() {
		this.log( "YoutubeRssButtons getChannelIdFromChannelPage" );
		
		const channel_id = $( `meta[itemprop="channelId"]` ).attr( "content" );
		
		this.log( "YoutubeRssButtons channel_id", channel_id );
		
		return channel_id;
	}

	YoutubeRssButtons.prototype.addChannelPageRssButton = function( channel_id ) {
		this.log( "YoutubeRssButtons addChannelPageRssButton", channel_id );
		
		const rss_url = this.createChannelRssUrl( channel_id );
		this.log( "YoutubeRssButtons rss_url", rss_url );
		
		const parent = $( "#subscribe-button" ).parent();
		this.log( "YoutubeRssButtons getPage", parent );
		
		parent.prepend( `
			<div id="youtube_rss_channel_rss_button" style="${ this.channel_rss_button_css }">
				<a href="${ rss_url }" style="${ this.channel_rss_link_css }">
					RSS
				</a>
			</div>
		` );
	}

	YoutubeRssButtons.prototype.createChannelRssUrl = function( channel_id ) {
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
	
	YoutubeRssButtons.prototype.log = function( message, object ) {
		if ( ! this.debug ) {
			return;
		}
		console.log( message, object );
	}

	new YoutubeRssButtons();

})();
