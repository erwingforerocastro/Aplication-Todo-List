<?php

namespace App\Http\Controllers;

use App\Todo;
use Illuminate\Http\Request;
use DB;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Todo::all();
    }



    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data=$request->validate([
            'title'=>'required|string',
            'completed'=>'required|boolean'
        ]);

        $todo = Todo::create($data);

        return response($todo,201);

    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Todo  $todo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Todo $todo)
    {
        $data=$request->validate([
            'title'=>'required|string',
            'completed'=>'required|boolean'
        ]);

        $todo->update($data);

        return response($todo,200);
    }

        /**
     * Update all resources in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Todo  $todo
     * @return \Illuminate\Http\Response
     */
    public function updateAll(Request $request)
    {
        $data=$request->validate([
            'completed'=>'required|boolean'
        ]);

        Todo::query()->update($data);

        return response('Actualizado',200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Todo  $todo
     * @return \Illuminate\Http\Response
     */
    public function destroy(Todo $todo)
    {   
        $todo->delete();
        DB::statement('ALTER TABLE todos AUTO_INCREMENT = 1');
        return response('elemento eliminado',200); 
    }

        /**
     * Remove all resource from storage.
     *
     * @param  \App\Todo  $todo
     * @return \Illuminate\Http\Response
     */
    public function destroyAll(Request $request)
    {   
        $data=$request->validate([
            'todos'=>'required|array'
        ]);

        Todo::destroy($request->todos);
        DB::statement('ALTER TABLE todos AUTO_INCREMENT = 1');

        return response('Todos eliminados',200); 
    }
}
