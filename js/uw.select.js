// ### UW Select

// This function creates the UW select menu
// For usage please refer to the [UW Web Components Select](http://uw.edu/brand/web/#select)
/* TODO: add accessiblity attributes to the html markup */

UW.Select = Backbone.View.extend({

  // The class to look for when rendering UW select menu.
  el : '.uw-select',

  // This property indicates the current index of the selected dropdown.
  current : 0,

  // Listing out the keys necessary for keyboard bindings.
  keyCodes :
  {
    enter: 13,
    spacebar : 32,
    tab : 9,
    up: 38,
    down: 40
  },

  // List the events within the view.
  // The two events needed trigger opening and closing the UW select menu
  events :
  {
    'keydown li'        : 'openMenuOnKeydown',
    'click li.active'   : 'open',
    'click li.inactive' : 'close',
  },

  // This is the template that replaces the standard select menu.
  // It will be placed after the select menu and mimics the values and
  // text for each option tag.
  template : '<div class="uw-select-mask">' +
              '<ul class="uw-select">' +
               '<% _.each( lis, function( title, value ) { %>' +
                 '<li data-value="<%= value %>"><a href="#"><%= title %></a></li>' +
               '<% }) %>'+
               '</ul>' +
               '<span class="uw-select-arrow"></span>' +
             '</div>',

  // Initialize the view, parse the standard select menu and render the UW select menu.
  initialize : function( options )
  {
    _.bindAll( this, 'open', 'close', 'addOpenClass', 'removeOpenClass' )
    this.options = _.extend( {}, this.settings, this.$el.data() , options )
    this.parseSelect()
    this.render()
  },

  // Open the UW select menu.
  open : function()
  {
    this.addOpenClass()
    return false
  },

  // Close the UW select menu.
  close : function( e )
  {
    this.clicked = true
    this.$target = $(e.currentTarget)
    this.current = this.$target.index()
    this.animate()
    this.toggleLIClasses()
    this.cloneSelectEvents()
    return false
  },

  // Animate the select menu to the proper menu item.
  animate : function()
  {
    this.scroll = this.$target.offset().top - this.$el.find('li').first().offset().top;
    //var current_top = this.$el.position().top;
    this.$el.animate( { scrollTop : this.scroll }, { queue: false, complete: this.removeOpenClass } )
    //this.$el.animate( { top : current_top - (this.$target.offset().top - this.$el.find('li.active').offset().top) }, { queue: false, complete: this.removeOpenClass } )
  },

  // Whenever an item is clicked on the UW select menu make sure the standard
  // select menu is set to that value as well.
  cloneSelectEvents : function()
  {
    this.$select.val( this.$el.find('li').eq( this.current ).data().value )
  },

  // Render the UW select menu HTML and then set the view's element to the newly
  // rendered HTML.
  // This also keeps a cached version of the select menu with the `this.$select` property.
  render : function()
  {
    this.html = _.template( this.template, { lis : this.LIs } )
    this.$el.hide().after( this.html )
    this.$select = this.$el
    this.setElement( this.$el.next().children('ul') )
    this.toggleLIClasses()
  },

  // Parse the standard select element and gather each option tags' values and text
  parseSelect : function()
  {
    var values  = _.map( this.$el.find('option'), this.getValue )
      , titles  = _.map( this.$el.find('option'), this.getText )
    this.current = this.$el.find(':selected').index()
    this.LIs    = _.object( values, titles )
  },

  toggleLIClasses : function()
  {
    this.$el.find('li').removeClass().addClass('inactive')
    this.$el.find('li').eq( this.current ).removeClass().addClass('active')
  },

  addOpenClass : function()
  {
      this.$el.addClass('open');
      this.$el.scrollTop(this.scroll);
  },

  removeOpenClass : function( forced )
  {
    if ( this.clicked || forced )
    {
    this.$el.removeClass('open')
      this.clicked = false;
    }
  },

  getText  : function( option )
  {
    return $(option).text()
  },

  getValue : function( option )
  {
    return option.value
  },

  // This makes the dropdown accessible to keyboard bindings.
  // The behavior is the same as the default behavior for a standard select menu.
  openMenuOnKeydown : function ( e )
  {
    // If the user tabs while the menu is not open then continue the focus to
    // the next element on the page.
    if ( e.keyCode == this.keyCodes.tab && ! this.isOpen() )
      return true;

    // If the user clicks a certain set of keys then proceed with the necessary
    // actions.
    if ( _.contains( this.keyCodes, e.keyCode ) )
    {
      if ( ! this.isOpen() ) this.open()
      switch ( e.keyCode )
      {

        case this.keyCodes.down :
          this.down()
          break;

        case this.keyCodes.up :
          this.up()
          break;

        // The spacebar and enter keys need to open the the inital
        case this.keyCodes.enter:
        case this.keyCodes.spacebar :
          if ( this.current != this.$select.val() ) {
            this.removeOpenClass( true )
            this.toggleLIClasses()
            this.cloneSelectEvents()
          }
          break;

      }
      return false;
    }
  },

  // Moves the menu up one when the up arrow is pressed.
  up : function()
  {
    if ( this.atEdge( 'up' ) ) return
    this.current -= 1
    this.move()
  },

  // Moves the menu down one when the down arrow is pressed.
  down : function()
  {
    if ( this.atEdge( 'down' ) ) return
    this.current += 1
    this.move()
  },

  // Aniamtes the select menu when either arrow is pressed in the proper direction.
  move : function()
  {
    this.$target = this.$el.find('li').eq(this.current)
    this.$target.find('a').focus()
    this.animate()
  },

  // This function checks to see if the the first or last item in the list is highlighted.
  atEdge : function( direction )
  {
    return ( this.current === 0 && direction === 'up' ||
             this.current === this.$el.find('li').length - 1 && direction === 'down' )
  },

  // Check to see if the menu is open.
  isOpen : function()
  {
    return this.$el.hasClass('open')
  }

})
