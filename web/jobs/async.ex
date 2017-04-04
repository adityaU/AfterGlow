defmodule AfterGlow.Async do
  use GenServer

  #client methods
  def start_link do
    GenServer.start_link(__MODULE__, nil , name: AfterGlow.AsyncTasks)
  end
  

  def perform(function, args) do
    GenServer.cast( AfterGlow.AsyncTasks, {:perform,function , args})
  end

  
  #genserver handle messages
  def init(_) do
    {:ok, nil}
  end

  def handle_cast({:perform, function, args}, _) do
    Task.start fn ->
      apply(function, args)
    end
    {:noreply, nil}
  end
end
