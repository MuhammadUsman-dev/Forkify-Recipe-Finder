import * as modal from './modal.js';
import RecipeView from './views/recipeview.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import SearchView from './views/searchview.js';
import ResultsView from './views/resultsview.js';
import PaginationView from './views/paginationview.js';
import BookmarksView from './views/bookmarksview.js';
import AddRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipies = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    RecipeView.renderSpinner();

    // Update results view to mark selected search result
    ResultsView.update(modal.getSearchResultsPage());

    // updating bookmarks view
    BookmarksView.update(modal.state.bookmarks);

    // 1 // loading recipe
    await modal.loadRecipe(id);

    // 2 rendering recipe

    RecipeView.render(modal.state.recipe);
  } catch (err) {
    RecipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    ResultsView.renderSpinner();

    // 1 - get search query
    const query = SearchView.getQuery();
    if (!query) return;

    // 2- load search results

    await modal.loadSearchResults(query);

    // 3 - render results

    // console.log(modal.state.search.results);
    ResultsView.render(modal.getSearchResultsPage());

    // 4 render initial pagination

    PaginationView.render(modal.state.search);
  } catch (err) {}
};

const controlPagination = function (goToPage) {
  // render new results
  ResultsView.render(modal.getSearchResultsPage(goToPage));

  // render NEW pagination buttons

  PaginationView.render(modal.state.search);
};

const controlServings = function (newServings) {
  // update the recipe servings(in state)

  modal.updateServings(newServings);

  // update the recipe view
  // RecipeView.render(modal.state.recipe);

  // we don't want to render the entire recipe
  // again and again with the updated recipe we will use update method
  // which will only update the attributes and DOM els

  RecipeView.update(modal.state.recipe);
};

const controlAddBookmark = function () {
  // 1- add-or remove bookmark
  if (!modal.state.recipe.bookmarked) modal.addBookmark(modal.state.recipe);
  else {
    modal.deleteBookmark(modal.state.recipe.id);
  }
  // update recipeview
  RecipeView.update(modal.state.recipe);

  //3 render bookmarks
  BookmarksView.render(modal.state.bookmarks);
};

const controlBookmarks = function () {
  BookmarksView.render(modal.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show spinner
    AddRecipeView.renderSpinner();
    // upload the new recipedata
    await modal.upoadRecipe(newRecipe);

    // render uploaded recipe
    RecipeView.render(modal.state.recipe);

    // success message
    AddRecipeView.renderMessage();

    // render bokmark view
    BookmarksView.render(modal.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${modal.state.recipe.id}`);

    // close form
    setTimeout(function () {
      AddRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🍟', err);
    AddRecipeView.renderError(err.message);
  }
};

const init = function () {
  BookmarksView.addHandlerRender(controlBookmarks);
  RecipeView.addHandlerRender(controlRecipies);
  RecipeView.addHandlerUpdateServings(controlServings);
  RecipeView.addHandlerBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPagination);
  AddRecipeView._addHandlerUpload(controlAddRecipe);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();
/*
architectural planning

1- Business Logic

code that solves the business logic



2 - STATE

stores all the data about the application running in the 
 browser(front end)

 should be the single source of truth

UI should be kept in sync with the state

state libraries exist

3 - HTTO Library 

responsible for making and receiving AJX requests

optional but almost necessary in real world applications

4 - Application Logic 

code that is only concerned about the implementation of application itself

handles navigation and UI events 







5 - Presentation Logic  (UI Layer )

code that is concerned about the visible part of the application

Essentially displays application state



















































*/
