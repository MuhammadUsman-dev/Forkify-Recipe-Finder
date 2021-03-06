import View from './view';
import PreviewView from './previewview.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errormessage = 'No recipies found for your query. Please try another one';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => PreviewView.render(result, false)).join('');
  }
}

export default new ResultsView();
