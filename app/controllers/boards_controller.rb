class BoardsController < ApplicationController

  def index
  end

  def show
    @board = Board.find(params[:id]||1)
  end

end
