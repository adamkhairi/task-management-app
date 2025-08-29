<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Project $project)
    {
        $this->authorize('view', $project);
        
        $tasks = $project->tasks()
            ->with(['assignedUser'])
            ->latest()
            ->paginate(10);
            
        return TaskResource::collection($tasks);
    }

    public function store(StoreTaskRequest $request, Project $project)
    {
        $this->authorize('view', $project);
        
        $task = $project->tasks()->create($request->validated());
        
        return new TaskResource($task->load(['assignedUser']));
    }

    public function show(Task $task)
    {
        $this->authorize('view', $task);
        
        return new TaskResource($task->load(['project', 'assignedUser']));
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $this->authorize('update', $task);
        
        $task->update($request->validated());
        
        return new TaskResource($task->load(['assignedUser']));
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        
        $task->delete();
        
        return response()->json(['message' => 'Task deleted successfully']);
    }
}
