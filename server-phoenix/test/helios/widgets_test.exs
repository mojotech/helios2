defmodule Helios.WidgetsTest do
  use Helios.DataCase

  alias Helios.Widgets

  alias Helios.Widgets.Widget

  @valid_attrs %{
    duration_seconds: 42,
    enabled: true,
    name: "some name",
    position: 42,
    show_weather: true,
    sidebar_text: "some sidebar_text",
    start: ~T[14:00:00],
    stop: ~T[14:00:00]
  }
  @update_attrs %{
    duration_seconds: 43,
    enabled: false,
    name: "some updated name",
    position: 43,
    show_weather: false,
    sidebar_text: "some updated sidebar_text",
    start: ~T[15:01:01],
    stop: ~T[15:01:01]
  }
  @invalid_attrs %{
    duration_seconds: nil,
    enabled: nil,
    name: nil,
    position: nil,
    show_weather: nil,
    sidebar_text: nil,
    start: nil,
    stop: nil
  }

  describe "#paginate_widgets/1" do
    test "returns paginated list of widgets" do
      for _ <- 1..20 do
        widget_fixture()
      end

      {:ok, %{widgets: widgets} = page} = Widgets.paginate_widgets(%{})

      assert length(widgets) == 15
      assert page.page_number == 1
      assert page.page_size == 15
      assert page.total_pages == 2
      assert page.total_entries == 20
      assert page.distance == 5
      assert page.sort_field == "inserted_at"
      assert page.sort_direction == "desc"
    end
  end

  describe "#list_widgets/0" do
    test "returns all widgets" do
      widget = widget_fixture()
      assert Widgets.list_widgets() == [widget]
    end
  end

  describe "#get_widget!/1" do
    test "returns the widget with given id" do
      widget = widget_fixture()
      assert Widgets.get_widget!(widget.id) == widget
    end
  end

  describe "#create_widget/1" do
    test "with valid data creates a widget" do
      assert {:ok, %Widget{} = widget} = Widgets.create_widget(@valid_attrs)
      assert widget.duration_seconds == 42
      assert widget.enabled == true
      assert widget.name == "some name"
      assert widget.position == 42
      assert widget.show_weather == true
      assert widget.sidebar_text == "some sidebar_text"
      assert widget.start == ~T[14:00:00]
      assert widget.stop == ~T[14:00:00]
    end

    test "with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Widgets.create_widget(@invalid_attrs)
    end
  end

  describe "#update_widget/2" do
    test "with valid data updates the widget" do
      widget = widget_fixture()
      assert {:ok, widget} = Widgets.update_widget(widget, @update_attrs)
      assert %Widget{} = widget
      assert widget.duration_seconds == 43
      assert widget.enabled == false
      assert widget.name == "some updated name"
      assert widget.position == 43
      assert widget.show_weather == false
      assert widget.sidebar_text == "some updated sidebar_text"
      assert widget.start == ~T[15:01:01]
      assert widget.stop == ~T[15:01:01]
    end

    test "with invalid data returns error changeset" do
      widget = widget_fixture()
      assert {:error, %Ecto.Changeset{}} = Widgets.update_widget(widget, @invalid_attrs)
      assert widget == Widgets.get_widget!(widget.id)
    end
  end

  describe "#delete_widget/1" do
    test "deletes the widget" do
      widget = widget_fixture()
      assert {:ok, %Widget{}} = Widgets.delete_widget(widget)
      assert_raise Ecto.NoResultsError, fn -> Widgets.get_widget!(widget.id) end
    end
  end

  describe "#change_widget/1" do
    test "returns a widget changeset" do
      widget = widget_fixture()
      assert %Ecto.Changeset{} = Widgets.change_widget(widget)
    end
  end

  def widget_fixture(attrs \\ %{}) do
    {:ok, widget} =
      attrs
      |> Enum.into(@valid_attrs)
      |> Widgets.create_widget()

    widget
  end

  alias Helios.Widgets.TrafficCam

  @valid_attrs %{feed_format: "some feed_format", title: "some title", url: "some url"}
  @update_attrs %{
    feed_format: "some updated feed_format",
    title: "some updated title",
    url: "some updated url"
  }
  @invalid_attrs %{feed_format: nil, title: nil, url: nil}

  describe "#paginate_traffic_cams/1" do
    test "returns paginated list of traffic_cams" do
      for _ <- 1..20 do
        traffic_cam_fixture()
      end

      {:ok, %{traffic_cams: traffic_cams} = page} = Widgets.paginate_traffic_cams(%{})

      assert length(traffic_cams) == 15
      assert page.page_number == 1
      assert page.page_size == 15
      assert page.total_pages == 2
      assert page.total_entries == 20
      assert page.distance == 5
      assert page.sort_field == "inserted_at"
      assert page.sort_direction == "desc"
    end
  end

  describe "#list_traffic_cams/0" do
    test "returns all traffic_cams" do
      traffic_cam = traffic_cam_fixture()
      assert Widgets.list_traffic_cams() == [traffic_cam]
    end
  end

  describe "#get_traffic_cam!/1" do
    test "returns the traffic_cam with given id" do
      traffic_cam = traffic_cam_fixture()
      assert Widgets.get_traffic_cam!(traffic_cam.id) == traffic_cam
    end
  end

  describe "#create_traffic_cam/1" do
    test "with valid data creates a traffic_cam" do
      assert {:ok, %TrafficCam{} = traffic_cam} = Widgets.create_traffic_cam(@valid_attrs)
      assert traffic_cam.feed_format == "some feed_format"
      assert traffic_cam.title == "some title"
      assert traffic_cam.url == "some url"
    end

    test "with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Widgets.create_traffic_cam(@invalid_attrs)
    end
  end

  describe "#update_traffic_cam/2" do
    test "with valid data updates the traffic_cam" do
      traffic_cam = traffic_cam_fixture()
      assert {:ok, traffic_cam} = Widgets.update_traffic_cam(traffic_cam, @update_attrs)
      assert %TrafficCam{} = traffic_cam
      assert traffic_cam.feed_format == "some updated feed_format"
      assert traffic_cam.title == "some updated title"
      assert traffic_cam.url == "some updated url"
    end

    test "with invalid data returns error changeset" do
      traffic_cam = traffic_cam_fixture()
      assert {:error, %Ecto.Changeset{}} = Widgets.update_traffic_cam(traffic_cam, @invalid_attrs)
      assert traffic_cam == Widgets.get_traffic_cam!(traffic_cam.id)
    end
  end

  describe "#delete_traffic_cam/1" do
    test "deletes the traffic_cam" do
      traffic_cam = traffic_cam_fixture()
      assert {:ok, %TrafficCam{}} = Widgets.delete_traffic_cam(traffic_cam)
      assert_raise Ecto.NoResultsError, fn -> Widgets.get_traffic_cam!(traffic_cam.id) end
    end
  end

  describe "#change_traffic_cam/1" do
    test "returns a traffic_cam changeset" do
      traffic_cam = traffic_cam_fixture()
      assert %Ecto.Changeset{} = Widgets.change_traffic_cam(traffic_cam)
    end
  end

  def traffic_cam_fixture(attrs \\ %{}) do
    {:ok, traffic_cam} =
      attrs
      |> Enum.into(@valid_attrs)
      |> Widgets.create_traffic_cam()

    traffic_cam
  end
end
