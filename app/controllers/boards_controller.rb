class BoardsController < ApplicationController

  def index
  end

  def show
    @board = Board.find(params[:id]||1)
  end

  def kanye
    @board = Board.new(sample_ids: [18, 19, 20, 21, 22, 23, 24, 25, 26] )
    render 'show'
  end

  def dropbox_test
    
  end
end
