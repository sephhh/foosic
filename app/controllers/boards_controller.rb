class BoardsController < ApplicationController

  def index
  end

  def show
  end

  def lookup
    @board = Board.find(params[:id])
    respond_to do |format|
      format.json {render json: @board.get_samples}
    end 
  end

  def create
  end

end
