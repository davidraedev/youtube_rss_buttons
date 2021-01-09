// ==UserScript==
// @name         Youtube Rss Buttons
// @namespace    youtube_rss_buttons
// @description  Add RSS Buttons to Youtube
// @homepageURL  https://github.com/daraeman/youtube_rss_buttons
// @author       daraeman
// @version      1.0
// @date         2021-01-09
// @include      https://www.youtube.com/*
// @require      https://code.jquery.com/jquery-3.5.1.slim.min.js
// @downloadURL  https://github.com/daraeman/youtube_rss_buttons/raw/master/youtube_rss_buttons.user.js
// @updateURL    https://github.com/daraeman/youtube_rss_buttons/raw/master/youtube_rss_buttons.meta.js
// ==/UserScript==

(function(){

	function YoutubeRssButtons() {
		this.channel_rss_button_css = `background: #ee802f; padding: 10px 16px; margin: 0px 6px;`;
		this.channel_rss_link_css = `color: rgb( 255,255,255 ); text-decoration: none; font-size: 14px; font-weight: bold;`;
		this.page;
		this.channel_id;

		this.init();
	}

	YoutubeRssButtons.prototype.init = function() {

		this.page = this.getPage();

		if ( this.page === "channel" ) {
			this.channel_id = this.getChannelIdFromChannelPage();
			this.addChannelPageRssButton( this.channel_id );
		}

	}

	YoutubeRssButtons.prototype.getChannelIdFromChannelPage = function() {
		return $( `meta[itemprop="channelId"]` ).attr( "content" );
	}

	YoutubeRssButtons.prototype.addChannelPageRssButton = function( channel_id ) {
		const rss_url = this.createChannelRssUrl( channel_id );
		return $( "#subscribe-button" ).parent()
									.prepend( `
										<div id="youtube_rss_channel_rss_button" style="${ this.channel_rss_button_css }">
											<a href="${ rss_url }" style="${ this.channel_rss_link_css }">
												RSS
											</a>
										</div>
									` );
	}

	YoutubeRssButtons.prototype.createChannelRssUrl = function( channel_id ) {
		return `https://www.youtube.com/feeds/videos.xml?channel_id=${ encodeURIComponent( channel_id ) }`;
	}

	YoutubeRssButtons.prototype.getPage = function() {
		if ( /https:\/\/www\.youtube\.com\/channel\//.test( window.location ) ) {
			return "channel";
		}
		return false;
	}

	new YoutubeRssButtons();

})();
